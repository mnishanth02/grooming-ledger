"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type CandidateColumn = {
  id: string;
  name: string;
  email: string;
  status: string;
  groomer: string;
  assessor: string;
  onboardingDate: string;
};

export const columns: ColumnDef<CandidateColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "groomer",
    header: "Groomer",
  },
  {
    accessorKey: "assessor",
    header: "Assessor",
  },
  {
    accessorKey: "onboardingDate",
    header: "Onboarding Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
