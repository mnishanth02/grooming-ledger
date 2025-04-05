"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  status: string;
}

interface CandidateListProps {
  candidates: Candidate[];
}

const formatStatus = (status: string): string => {
  // Replace underscores with spaces and capitalize each word
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  // Determine badge variant based on status
  if (status.includes("FAILED")) return "destructive";
  if (status.includes("COMPLETED") || status.includes("PASSED") || status === "PLACED")
    return "default";
  if (status.includes("PENDING") || status.includes("SCHEDULED") || status.includes("IN_PROGRESS"))
    return "secondary";
  return "outline";
};

export default function CandidateList({ candidates }: CandidateListProps) {
  const params = useParams();
  const teamId = params.teamId as string;
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  if (!candidates.length) {
    return <p className="text-muted-foreground text-sm">No candidates assigned</p>;
  }

  return (
    <div className="relative overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-medium">Name</TableHead>
            <TableHead className="font-medium">Email</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow
              key={candidate.id}
              className="transition-colors"
              onMouseEnter={() => setHoveredRow(candidate.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <TableCell className="font-medium">{candidate.name}</TableCell>
              <TableCell>{candidate.email}</TableCell>
              <TableCell>
                <Badge
                  variant={getStatusColor(candidate.status)}
                  className="transition-all hover:scale-105"
                >
                  {formatStatus(candidate.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <Link
                  href={`/admin/${teamId}/candidates/${candidate.id}`}
                  className={`inline-flex size-8 items-center justify-center rounded-md border border-input bg-background p-0 font-medium text-sm transition-all hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${hoveredRow === candidate.id ? "scale-110 border-primary" : ""}
                                    `}
                  aria-label={`View details for ${candidate.name}`}
                >
                  {hoveredRow === candidate.id ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
