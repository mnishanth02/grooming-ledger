"use client";

import { SearchIcon, UserIcon, UsersIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { searchPeopleAction } from "@/data/actions/user.actions";
import type { SearchItem } from "@/data/data-access/user.queries";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

export default function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Get teamId from the URL params
  const params = useParams<{ teamId: string }>();
  const teamId = params?.teamId as string;

  // Setup the action hook
  const { execute: executeSearch, isPending: isLoading } = useAction(searchPeopleAction, {
    onSuccess: (response) => {
      // Extract results from nested response structure
      if (response.data?.data && Array.isArray(response.data.data)) {
        setSearchResults(response.data.data);
      } else if (Array.isArray(response.data)) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
      }
      setHasSearched(true);
    },
    onError: (error) => {
      setSearchResults([]);
      toast.error(error.error?.serverError || "Failed to search. Please try again.");
      setHasSearched(true);
    },
  });

  // Toggle the search dialog
  const toggleSearch = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSearch();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggleSearch]);

  // Add debounce functionality
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search function with debounce
  const handleSearch = useCallback(
    (query: string) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setSearchQuery(query);

      if (!query) {
        setSearchResults([]);
        setHasSearched(false);
        return;
      }

      // Set a loading state immediately
      setHasSearched(false);

      // Use 300ms debounce as requested
      timeoutRef.current = setTimeout(() => {
        executeSearch({
          searchQuery: query,
          teamId,
        });
      }, 300);
    },
    [executeSearch, teamId],
  );

  // Pre-filter candidates and associates for performance
  const candidateResults = searchResults.filter((item) => item.type === "candidate");
  const associateResults = searchResults.filter((item) => item.type === "associate");

  // Reset search when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state when closing the dialog
      setSearchQuery("");
      setSearchResults([]);
      setHasSearched(false);
      setSelectedItem(null);
    }
    setOpen(newOpen);
  };

  // Determine if we should show empty state
  const showEmptyState =
    hasSearched && !isLoading && searchResults.length === 0 && searchQuery.trim() !== "";
  const showInitialState = !hasSearched && !isLoading && searchQuery.trim() === "";

  // Determine layout based on search results
  const hasBothTypes = candidateResults.length > 0 && associateResults.length > 0;
  const hasCandidatesOnly = candidateResults.length > 0 && associateResults.length === 0;
  const hasAssociatesOnly = candidateResults.length === 0 && associateResults.length > 0;

  // Render a search result item based on type
  const renderSearchItem = (item: SearchItem) => {
    const icon =
      item.type === "candidate" ? (
        <UserIcon className="mr-2 h-4 w-4 shrink-0 opacity-70" />
      ) : (
        <UsersIcon className="mr-2 h-4 w-4 shrink-0 opacity-70" />
      );

    const href =
      item.type === "candidate" ? `/admin/candidates/${item.id}` : `/admin/associates/${item.id}`;

    const isSelected = selectedItem === item.id;

    return (
      <CommandItem
        key={item.id}
        onSelect={() => {
          window.location.href = href;
          setOpen(false);
        }}
        className={cn(
          "flex items-center justify-between px-4 py-3 transition-colors",
          isSelected && "bg-accent ",
        )}
        onMouseEnter={() => setSelectedItem(item.id)}
      >
        <div className="flex items-center">
          {icon}
          <div className="overflow-hidden text-sm">
            <p className="truncate font-medium">{item.name}</p>
            <p className="truncate text-accent-foreground/60 text-xs">{item.email}</p>
          </div>
        </div>
      </CommandItem>
    );
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="relative h-9 w-full justify-start text-sm sm:w-52 md:w-80 lg:flex"
        onClick={toggleSearch}
      >
        <SearchIcon className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search candidates & associates...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute top-2 right-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-xs opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <div className="w-full max-w-4xl">
          <Command shouldFilter={false} className="max-h-[80vh]">
            <div className="flex items-center border-b px-3">
              <CommandInput
                placeholder="Search people..."
                value={searchQuery}
                onValueChange={handleSearch}
                className="h-12"
                autoFocus
              />
            </div>

            <div className="p-0">
              {isLoading && (
                <div className="py-12 text-center text-sm">
                  <div
                    className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
                    aria-hidden="true"
                  />
                  <p className="mt-2">Searching...</p>
                </div>
              )}

              {showInitialState && (
                <div className="py-16 text-center text-muted-foreground">
                  <SearchIcon className="mx-auto h-8 w-8 opacity-40" />
                  <p className="mt-2 text-sm">Type to search for candidates and associates...</p>
                  <p className="mt-1 text-muted-foreground text-xs">
                    Use ↑ and ↓ arrows to navigate, Enter to select
                  </p>
                </div>
              )}

              {showEmptyState && (
                <CommandEmpty className="py-12 text-center">
                  <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                  <p className="mt-2 text-muted-foreground text-xs">Try a different search term</p>
                </CommandEmpty>
              )}

              {!isLoading && !showEmptyState && !showInitialState && (
                <div
                  className={cn(
                    "flex",
                    hasCandidatesOnly || hasAssociatesOnly ? "flex-col" : "flex-row divide-x",
                  )}
                >
                  {/* Candidates Column */}
                  {candidateResults.length > 0 && (
                    <div className={cn("overflow-auto", hasBothTypes ? "w-1/2" : "w-full")}>
                      <CommandList className="max-h-[60vh]">
                        <CommandGroup
                          heading="Candidates"
                          className="px-4 py-2 font-semibold text-sm"
                        >
                          {candidateResults.map(renderSearchItem)}
                        </CommandGroup>
                      </CommandList>
                    </div>
                  )}

                  {/* Associates Column */}
                  {associateResults.length > 0 && (
                    <div className={cn("overflow-auto", hasBothTypes ? "w-1/2" : "w-full")}>
                      <CommandList className="max-h-[60vh]">
                        <CommandGroup
                          heading="Associates"
                          className="px-4 py-2 font-semibold text-sm"
                        >
                          {associateResults.map(renderSearchItem)}
                        </CommandGroup>
                      </CommandList>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Command>
        </div>
      </CommandDialog>
    </>
  );
}
