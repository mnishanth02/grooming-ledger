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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchPeopleAction } from "@/data/actions/user.actions";
import type { SearchItem } from "@/data/data-access/user.queries";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

type TabValue = "all" | "candidates" | "associates";

export default function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [hasSearched, setHasSearched] = useState(false);

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
    }
    setOpen(newOpen);
  };

  // Determine if we should show empty state
  const showEmptyState =
    hasSearched && !isLoading && searchResults.length === 0 && searchQuery.trim() !== "";
  const showInitialState = !hasSearched && !isLoading && searchQuery.trim() === "";

  // Render a search result item based on type
  const renderSearchItem = (item: SearchItem) => {
    console.log(item);

    const icon =
      item.type === "candidate" ? (
        <UserIcon className="mr-2 h-4 w-4 shrink-0 opacity-70" />
      ) : (
        <UsersIcon className="mr-2 h-4 w-4 shrink-0 opacity-70" />
      );

    const href =
      item.type === "candidate" ? `/admin/candidates/${item.id}` : `/admin/associates/${item.id}`;
    return (
      <CommandItem
        key={item.id}
        onSelect={() => {
          window.location.href = href;
          setOpen(false);
        }}
        className="flex items-center"
      >
        {icon}
        <div className="overflow-hidden text-sm">
          <p className="truncate font-medium">{item.name}</p>
          <p className="truncate text-muted-foreground text-xs">{item.email}</p>
        </div>
        {item.role && <span className="ml-auto text-muted-foreground text-xs">{item.role}</span>}
      </CommandItem>
    );
  };

  // Debug state changes
  useEffect(() => {
    console.log("State updated:", {
      open,
      activeTab,
      isLoading,
      candidateResults: searchResults.filter((item) => item.type === "candidate"),
      searchQuery,
      hasSearched,
    });
  }, [open, activeTab, isLoading, searchResults, searchQuery, hasSearched]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="relative h-9 w-full justify-start text-sm sm:w-64 md:w-80 lg:flex"
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
        <div className="w-full">
          <Command shouldFilter={false}>
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={(value: string) => setActiveTab(value as TabValue)}
            >
              <div className="flex items-center border-b px-3">
                <CommandInput
                  placeholder="Search people..."
                  value={searchQuery}
                  onValueChange={handleSearch}
                  className="h-9"
                  autoFocus
                />
                <TabsList className="ml-auto h-9 bg-transparent">
                  <TabsTrigger value="all" className="px-2 text-xs">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="candidates" className="px-2 text-xs">
                    Candidates
                  </TabsTrigger>
                  <TabsTrigger value="associates" className="px-2 text-xs">
                    Associates
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="mt-0 p-0">
                <CommandList>
                  {isLoading && <div className="py-6 text-center text-sm">Loading...</div>}

                  {showInitialState && (
                    <div className="py-6 text-center text-muted-foreground text-sm">
                      Type to search for people...
                    </div>
                  )}

                  {showEmptyState && <CommandEmpty>No results found.</CommandEmpty>}

                  {!isLoading && candidateResults.length > 0 && activeTab !== "associates" && (
                    <CommandGroup heading="Candidates">
                      {candidateResults.map(renderSearchItem)}
                    </CommandGroup>
                  )}

                  {!isLoading && associateResults.length > 0 && activeTab !== "candidates" && (
                    <CommandGroup heading="Associates">
                      {associateResults.map(renderSearchItem)}
                    </CommandGroup>
                  )}
                </CommandList>
              </TabsContent>
            </Tabs>
          </Command>
        </div>
      </CommandDialog>
    </>
  );
}
