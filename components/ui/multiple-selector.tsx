"use client";

import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import * as React from "react";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  /** fixed option that can't be removed. */
  fixed?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}

interface GroupOption {
  [key: string]: Option[];
}

interface MultipleSelectorProps {
  value?: Option[];
  defaultOptions?: Option[];
  /** manually controlled options */
  options?: Option[];
  placeholder?: string;
  /** Loading component. */
  loadingIndicator?: React.ReactNode;
  /** Empty component. */
  emptyIndicator?: React.ReactNode;
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number;
  /**
   * Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   **/
  triggerSearchOnFocus?: boolean;
  /** async search */
  onSearch?: (value: string) => Promise<Option[]>;
  /** sync search */
  onSearchSync?: (value: string) => Option[];
  onChange?: (options: Option[]) => void;
  /** Limit the maximum number of selected options. */
  maxSelected?: number;
  /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
  onMaxSelected?: (maxLimit: number) => void;
  /** Hide the placeholder when there are options selected. */
  hidePlaceholderWhenSelected?: boolean;
  disabled?: boolean;
  /** Group the options base on provided key. */
  groupBy?: string;
  className?: string;
  badgeClassName?: string;
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   */
  selectFirstItem?: boolean;
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean;
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    "value" | "placeholder" | "disabled"
  >;
  /** hide the clear all button. */
  hideClearAllButton?: boolean;
}

export interface MultipleSelectorRef {
  selectedValue: Option[];
  input: HTMLInputElement;
  focus: () => void;
  reset: () => void;
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function transToGroupOption(options: Option[], groupBy?: string): GroupOption {
  if (options.length === 0) {
    return {};
  }

  if (!groupBy) {
    return { "": options };
  }

  const groupOption: GroupOption = {};

  for (const option of options) {
    const key = (option[groupBy] as string) || "";
    if (!groupOption[key]) {
      groupOption[key] = [];
    }
    groupOption[key].push(option);
  }

  return groupOption;
}

function removePickedOption(groupOption: GroupOption, picked: Option[]): GroupOption {
  const cloneOption = structuredClone(groupOption);
  const pickedValues = new Set(picked.map((p) => p.value));

  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter((val) => !pickedValues.has(val.value));
  }

  return cloneOption;
}

function isOptionsExist(groupOption: GroupOption, targetOption: Option[]): boolean {
  const targetValues = new Set(targetOption.map((p) => p.value));

  for (const options of Object.values(groupOption)) {
    if (options.some((option) => targetValues.has(option.value))) {
      return true;
    }
  }

  return false;
}

const CommandEmpty = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);

  if (!render) return null;

  return (
    <div
      ref={forwardedRef}
      className={cn("py-6 text-center text-sm", className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  );
});

CommandEmpty.displayName = "CommandEmpty";

const DefaultLoadingIndicator = () => (
  <div className="flex items-center justify-center py-6">
    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
  </div>
);

const MultipleSelector = React.forwardRef<MultipleSelectorRef, MultipleSelectorProps>(
  (
    {
      value,
      onChange,
      placeholder = "Select options...",
      defaultOptions = [],
      options: arrayOptions,
      delay = 500,
      onSearch,
      onSearchSync,
      loadingIndicator = <DefaultLoadingIndicator />,
      emptyIndicator = <div className="py-6 text-center text-sm">No results found.</div>,
      maxSelected = Number.MAX_SAFE_INTEGER,
      onMaxSelected,
      hidePlaceholderWhenSelected,
      disabled,
      groupBy,
      className,
      badgeClassName,
      selectFirstItem = true,
      creatable = false,
      triggerSearchOnFocus = false,
      commandProps,
      inputProps,
      hideClearAllButton = false,
    }: MultipleSelectorProps,
    ref: React.Ref<MultipleSelectorRef>,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [onScrollbar, setOnScrollbar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState<Option[]>(value || []);
    const [options, setOptions] = useState<GroupOption>(
      transToGroupOption(defaultOptions, groupBy),
    );
    const [inputValue, setInputValue] = useState("");
    const debouncedSearchTerm = useDebounce(inputValue, delay);

    // Imperative handle for external control
    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: [...selected],
        input: inputRef.current as HTMLInputElement,
        focus: () => inputRef?.current?.focus(),
        reset: () => setSelected([]),
      }),
      [selected],
    );

    // Handle click outside to close dropdown
    const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        inputRef.current.blur();
      }
    }, []);

    // Handle removing an option
    const handleUnselect = useCallback(
      (option: Option) => {
        const newOptions = selected.filter((s) => s.value !== option.value);
        setSelected(newOptions);
        onChange?.(newOptions);
      },
      [onChange, selected],
    );

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (!input) return;

        if (
          (e.key === "Delete" || e.key === "Backspace") &&
          input.value === "" &&
          selected.length > 0
        ) {
          const lastOption = selected[selected.length - 1];
          if (!lastOption.fixed) {
            handleUnselect(lastOption);
          }
        }

        if (e.key === "Escape") {
          input.blur();
          setOpen(false);
        }
      },
      [handleUnselect, selected],
    );

    // Handle click outside effect
    useEffect(() => {
      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchend", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchend", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchend", handleClickOutside);
      };
    }, [open, handleClickOutside]);

    // Sync with external value prop
    useEffect(() => {
      if (value) {
        setSelected(value);
      }
    }, [value]);

    // Sync with external options prop
    useEffect(() => {
      if (!arrayOptions || onSearch) {
        return;
      }
      const newOption = transToGroupOption(arrayOptions || [], groupBy);
      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
        setOptions(newOption);
      }
    }, [arrayOptions, groupBy, onSearch, options]);

    // Handle sync search
    useEffect(() => {
      if (!onSearchSync || !open) return;

      const doSearchSync = () => {
        const res = onSearchSync?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || [], groupBy));
      };

      if (triggerSearchOnFocus || debouncedSearchTerm) {
        doSearchSync();
      }
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus, onSearchSync]);

    // Handle async search
    useEffect(() => {
      if (!onSearch || !open) return;

      const doSearch = async () => {
        setIsLoading(true);
        try {
          const res = await onSearch(debouncedSearchTerm);
          setOptions(transToGroupOption(res || [], groupBy));
        } catch (error) {
          console.error("Error during search:", error);
        } finally {
          setIsLoading(false);
        }
      };

      if (triggerSearchOnFocus || debouncedSearchTerm) {
        void doSearch();
      }
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus, onSearch]);

    // Render creatable item when input doesn't match existing options
    const CreatableItem = useCallback(() => {
      if (!creatable || !inputValue || inputValue.trim() === "") return undefined;

      if (
        isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
        selected.some((s) => s.value === inputValue)
      ) {
        return undefined;
      }

      const handleSelectCreatable = () => {
        if (selected.length >= maxSelected) {
          onMaxSelected?.(selected.length);
          return;
        }

        const newOptions = [...selected, { value: inputValue, label: inputValue }];
        setSelected(newOptions);
        onChange?.(newOptions);
        setInputValue("");
      };

      if ((onSearch && !isLoading) || !onSearch) {
        return (
          <CommandItem
            value={inputValue}
            className="flex cursor-pointer items-center"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onSelect={handleSelectCreatable}
          >
            <div className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              <span>Create "{inputValue}"</span>
            </div>
          </CommandItem>
        );
      }

      return undefined;
    }, [
      creatable,
      inputValue,
      isLoading,
      maxSelected,
      onChange,
      onMaxSelected,
      onSearch,
      options,
      selected,
    ]);

    // Render empty state
    const EmptyItem = useCallback(() => {
      if (!emptyIndicator) return undefined;

      if (onSearch && !creatable && Object.keys(options).length === 0) {
        return (
          <CommandItem value="-" disabled>
            {emptyIndicator}
          </CommandItem>
        );
      }

      return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
    }, [creatable, emptyIndicator, onSearch, options]);

    // Filter out already selected options
    const selectables = useMemo(() => removePickedOption(options, selected), [options, selected]);

    // Configure command filter behavior
    const commandFilter = useCallback(() => {
      if (commandProps?.filter) {
        return commandProps.filter;
      }

      if (creatable) {
        return (value: string, search: string) => {
          return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
        };
      }

      return undefined;
    }, [creatable, commandProps?.filter]);

    // Check if any option is clearable
    const hasClearableOptions = useMemo(
      () => selected.length > 0 && selected.some((option) => !option.fixed),
      [selected],
    );

    // Handle clearing all non-fixed options
    const handleClearAll = useCallback(() => {
      const fixedOptions = selected.filter((s) => s.fixed);
      setSelected(fixedOptions);
      onChange?.(fixedOptions);
    }, [onChange, selected]);

    return (
      <Command
        ref={dropdownRef}
        {...commandProps}
        onKeyDown={(e) => {
          handleKeyDown(e);
          commandProps?.onKeyDown?.(e);
        }}
        className={cn("h-auto overflow-visible bg-transparent", commandProps?.className)}
        shouldFilter={
          commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : !onSearch
        }
        filter={commandFilter()}
      >
        <div
          className={cn(
            "relative min-h-10 rounded-md border border-input bg-background text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 md:text-sm",
            {
              "px-3 py-2": selected.length !== 0,
              "cursor-text": !disabled && selected.length !== 0,
              "opacity-50": disabled,
            },
            className,
          )}
          onClick={() => {
            if (disabled) return;
            inputRef?.current?.focus();
          }}
          aria-expanded={open}
          aria-haspopup="listbox"
          role="combobox"
          tabIndex={disabled ? -1 : 0}
        >
          <div className="relative flex flex-wrap gap-1">
            {selected.map((option) => (
              <Badge
                key={option.value}
                className={cn(
                  "data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground",
                  "data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground",
                  "transition-all",
                  badgeClassName,
                )}
                data-fixed={option.fixed}
                data-disabled={disabled || undefined}
              >
                {option.label}
                <button
                  className={cn(
                    "ml-1 cursor-pointer rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    (disabled || option.fixed) && "hidden",
                  )}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                  aria-label={`Remove ${option.label}`}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))}
            <CommandPrimitive.Input
              {...inputProps}
              ref={inputRef}
              value={inputValue}
              disabled={disabled}
              onValueChange={(value) => {
                setInputValue(value);
                inputProps?.onValueChange?.(value);
              }}
              onBlur={(event) => {
                if (!onScrollbar) {
                  setOpen(false);
                }
                inputProps?.onBlur?.(event);
              }}
              onFocus={(event) => {
                setOpen(true);
                triggerSearchOnFocus &&
                  (onSearch || onSearchSync) &&
                  (onSearch?.(debouncedSearchTerm) || onSearchSync?.(debouncedSearchTerm));
                inputProps?.onFocus?.(event);
              }}
              placeholder={hidePlaceholderWhenSelected && selected.length !== 0 ? "" : placeholder}
              className={cn(
                "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
                {
                  "w-full": hidePlaceholderWhenSelected,
                  "px-3 py-2": selected.length === 0,
                  "ml-1": selected.length !== 0,
                },
                inputProps?.className,
              )}
              aria-controls="selector-options"
            />
            {hasClearableOptions && !hideClearAllButton && !disabled && (
              <button
                type="button"
                aria-label="Clear all selected options"
                onClick={handleClearAll}
                className="-translate-y-1/2 absolute top-1/2 right-0 h-6 w-6 p-0 opacity-70 transition-opacity hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="-translate-y-1/2 absolute top-1/2 right-0">
              <ChevronsUpDown
                className={cn(
                  "h-4 w-4 opacity-50 transition-all",
                  open ? "rotate-180" : "",
                  (disabled || (hasClearableOptions && !hideClearAllButton)) && "hidden",
                )}
              />
            </div>
          </div>
        </div>
        <div className="relative">
          {open && (
            <CommandList
              className="absolute top-1 z-10 max-h-60 w-full animate-in rounded-md border bg-popover text-popover-foreground shadow-md outline-none"
              onMouseLeave={() => setOnScrollbar(false)}
              onMouseEnter={() => setOnScrollbar(true)}
              onMouseUp={() => inputRef?.current?.focus()}
              id="selector-options"
            >
              {isLoading ? (
                loadingIndicator
              ) : (
                <>
                  {EmptyItem()}
                  {CreatableItem()}
                  {!selectFirstItem && <CommandItem value="-" className="hidden" />}
                  {Object.entries(selectables).map(([key, dropdowns]) => (
                    <CommandGroup
                      key={key}
                      heading={key || undefined}
                      className="h-full overflow-auto"
                    >
                      {dropdowns.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          disabled={option.disable}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onSelect={() => {
                            if (selected.length >= maxSelected) {
                              onMaxSelected?.(selected.length);
                              return;
                            }
                            setInputValue("");
                            const newOptions = [...selected, option];
                            setSelected(newOptions);
                            onChange?.(newOptions);
                          }}
                          className={cn(
                            "flex cursor-pointer items-center justify-between",
                            option.disable && "cursor-default text-muted-foreground",
                          )}
                        >
                          <span>{option.label}</span>
                          {selected.some((item) => item.value === option.value) && (
                            <Check className="ml-auto h-4 w-4 opacity-70" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </>
              )}
            </CommandList>
          )}
        </div>
      </Command>
    );
  },
);

MultipleSelector.displayName = "MultipleSelector";
export { MultipleSelector };

// Missing import for Plus icon
const Plus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);
