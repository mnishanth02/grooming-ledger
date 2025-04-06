"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CandidateWithAssessorAndGroomer } from "@/data/data-access/candidate.queries";
import { format } from "date-fns";
import { Download, Loader2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface ReportsClientProps {
  candidates: CandidateWithAssessorAndGroomer[];
  teamId: string;
}

type StatusFilter = "all" | "new" | "assessment" | "grooming" | "final" | "placed" | "terminated";

const statusGroups = {
  new: ["NEW", "PRE_ASSESSMENT_PENDING"],
  assessment: ["PRE_ASSESSMENT_COMPLETED", "ASSESSMENT_PASSED", "ASSESSMENT_FAILED"],
  grooming: ["GROOMING_IN_PROGRESS", "GROOMING_COMPLETED", "RE_GROOMING_SCHEDULED"],
  final: [
    "POST_ASSESSMENT_PENDING",
    "POST_ASSESSMENT_COMPLETED",
    "CLIENT_INTERVIEW_SCHEDULED",
    "CLIENT_INTERVIEW_FAILED",
  ],
  placed: ["PLACED"],
  terminated: ["TERMINATED"],
};

// Format date helper function - updated to use date-fns which is safer for SSR/CSR
const formatDate = (dateString: string | Date | null | undefined) => {
  if (!dateString) return "N/A";
  try {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;
    // Use date-fns format for consistent formatting between server and client
    return format(date as Date, "yyyy-MM-dd");
  } catch {
    return "Invalid date";
  }
};

const ReportsClient = ({ candidates, teamId }: ReportsClientProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [groomerFilter, setGroomerFilter] = useState("all");
  const [assessorFilter, setAssessorFilter] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  // Get unique groomers and assessors for filter dropdowns
  const uniqueGroomers = useMemo(() => {
    const groomers = [...new Set(candidates.map((c) => c.assignedGroomer?.name).filter(Boolean))];
    return ["all", ...groomers] as string[];
  }, [candidates]);

  const uniqueAssessors = useMemo(() => {
    const assessors = [...new Set(candidates.map((c) => c.assignedAssessor?.name).filter(Boolean))];
    return ["all", ...assessors] as string[];
  }, [candidates]);

  // Filter candidates based on all filters
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch =
        searchTerm === "" ||
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusGroups[statusFilter as keyof typeof statusGroups]?.includes(candidate.status) ??
          false);

      const matchesGroomer =
        groomerFilter === "all" || candidate.assignedGroomer?.name === groomerFilter;

      const matchesAssessor =
        assessorFilter === "all" || candidate.assignedAssessor?.name === assessorFilter;

      return matchesSearch && matchesStatus && matchesGroomer && matchesAssessor;
    });
  }, [candidates, searchTerm, statusFilter, groomerFilter, assessorFilter]);

  // Export to Excel - updated with more reliable date formatting
  const handleExport = async () => {
    try {
      setIsExporting(true);

      const exportData = filteredCandidates.map((candidate) => ({
        Name: candidate.name,
        Email: candidate.email,
        Phone: candidate.phone || "N/A",
        Status: candidate.status,
        Assessor: candidate.assignedAssessor?.name || "N/A",
        Groomer: candidate.assignedGroomer?.name || "N/A",
        "Created Date": formatDate(candidate.createdAt),
        "Updated Date": formatDate(candidate.updatedAt),
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

      // Generate file name with current date using date-fns format
      const fileName = `candidates_report_${teamId}_${format(new Date(), "yyyy-MM-dd")}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast.success("Report exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export report");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter candidates by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9"
              />
            </div>

            <div>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as StatusFilter)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="grooming">Grooming</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="placed">Placed</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={groomerFilter} onValueChange={setGroomerFilter}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Groomer" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueGroomers.map((groomer) => (
                    <SelectItem key={groomer} value={groomer}>
                      {groomer === "all" ? "All Groomers" : groomer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={assessorFilter} onValueChange={setAssessorFilter}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Assessor" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueAssessors.map((assessor) => (
                    <SelectItem key={assessor} value={assessor}>
                      {assessor === "all" ? "All Assessors" : assessor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? "s" : ""}{" "}
              found
            </CardDescription>
          </div>
          <Button
            onClick={handleExport}
            className="h-9 cursor-pointer"
            variant="outline"
            disabled={isExporting || filteredCandidates.length === 0}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export to Excel
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assessor</TableHead>
                  <TableHead>Groomer</TableHead>
                  <TableHead>Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.email}</TableCell>
                      <TableCell>{candidate.status}</TableCell>
                      <TableCell>{candidate.assignedAssessor?.name || "N/A"}</TableCell>
                      <TableCell>{candidate.assignedGroomer?.name || "N/A"}</TableCell>
                      <TableCell>{formatDate(candidate.createdAt)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No candidates match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsClient;
