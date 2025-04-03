"use client";

import type { ColumnDef } from "@tanstack/react-table";

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
    accessorKey: "email",
    header: "Email",
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
];
