"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const isSortable = column.getCanSort();

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <span className="whitespace-nowrap">{title}</span>
      {isSortable && (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 data-[state=sorted]:bg-accent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
          <span className="sr-only">Sort by {title}</span>
        </Button>
      )}
    </div>
  );
}
