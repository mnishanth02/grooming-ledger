"use client";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";

// Type for the table row data
export interface AssociateColumn {
  id: string;
  name: string;
  email: string;
  currentAssessorAssigned: string;
  currentGroomerAssigned: string;
  skills: string[];
}

// Define the columns for the data table
export const columns: ColumnDef<AssociateColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Associate Name" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("email")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "currentAssessorAssigned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Current Assessor Assignments" />
    ),
    cell: ({ row }) => {
      return <div className="text-muted-foreground">{row.getValue("currentAssessorAssigned")}</div>;
    },
  },
  {
    accessorKey: "currentGroomerAssigned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Current Groomer Assignments" />
    ),
    cell: ({ row }) => {
      return <div className="text-muted-foreground">{row.getValue("currentGroomerAssigned")}</div>;
    },
  },
  {
    accessorKey: "skills",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Skills" />,
    cell: ({ row }) => {
      const skills = row.getValue<string[]>("skills");

      if (!skills || skills.length === 0) {
        return <div className="text-muted-foreground">No skills</div>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {skills.slice(0, 2).map((skill) => (
            <Badge key={skill} variant="outline" className="px-1 py-0 text-xs">
              {skill}
            </Badge>
          ))}
          {skills.length > 2 && (
            <Badge variant="outline" className="px-1 py-0 text-xs">
              +{skills.length - 2} more
            </Badge>
          )}
        </div>
      );
    },
  },
];
