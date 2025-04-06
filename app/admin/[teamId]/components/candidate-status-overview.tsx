"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import type { CandidateWithAssessorAndGroomer } from "@/data/data-access/candidate.queries";
import { Cell, Label, Legend, Pie, PieChart, Tooltip } from "recharts";

interface CandidateStatusOverviewProps {
  candidates: CandidateWithAssessorAndGroomer[];
}

// Chart payload types
interface ChartDataItem {
  name: string;
  value: number;
  key: string;
  percentage: number;
}

// Status groups for simplified view
const statusGroups = {
  NEW: ["NEW", "PRE_ASSESSMENT_PENDING"],
  ASSESSMENT: ["PRE_ASSESSMENT_COMPLETED", "ASSESSMENT_PASSED", "ASSESSMENT_FAILED"],
  GROOMING: ["GROOMING_IN_PROGRESS", "GROOMING_COMPLETED", "RE_GROOMING_SCHEDULED"],
  FINAL: [
    "POST_ASSESSMENT_PENDING",
    "POST_ASSESSMENT_COMPLETED",
    "CLIENT_INTERVIEW_SCHEDULED",
    "CLIENT_INTERVIEW_FAILED",
  ],
  PLACED: ["PLACED"],
  OTHER: ["TERMINATED"],
};

// Set up chart config following shadcn/ui patterns
const chartConfig = {
  new: {
    label: "New",
    color: "#0088FE",
  },
  assessment: {
    label: "Assessment",
    color: "#00C49F",
  },
  grooming: {
    label: "Grooming",
    color: "#FFBB28",
  },
  final: {
    label: "Final",
    color: "#FF8042",
  },
  placed: {
    label: "Placed",
    color: "#8884D8",
  },
  other: {
    label: "Other",
    color: "#FF0000",
  },
};

const CandidateStatusOverview = ({ candidates }: CandidateStatusOverviewProps) => {
  // Process data for the chart
  const statusCounts: ChartDataItem[] = Object.entries(statusGroups)
    .map(([group, statuses]) => {
      const count = candidates.filter((c) => statuses.includes(c.status)).length;
      const key = group.toLowerCase();

      return {
        name: group,
        value: count,
        key,
        // Use percentage if needed
        percentage: candidates.length ? Math.round((count / candidates.length) * 100) : 0,
      };
    })
    .filter((item) => item.value > 0);

  // Create a simple center label
  const renderCustomizedLabel = () => {
    if (statusCounts.length !== 1) return null;

    return (
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="recharts-text recharts-label"
      >
        <tspan x="50%" dy="-0.5em" fontSize="16" fontWeight="bold">
          {statusCounts[0].name}
        </tspan>
        <tspan x="50%" dy="1.5em" fill="#666">
          {statusCounts[0].percentage}%
        </tspan>
      </text>
    );
  };

  return (
    <Card className="col-span-1 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="font-medium text-lg">Candidate Status Overview</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Distribution of candidates by current status
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-6">
        <div className="h-[300px]">
          {candidates.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <PieChart>
                <Pie
                  data={statusCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={0}
                  labelLine={false}
                >
                  {statusCounts.map((entry) => (
                    <Cell
                      key={`cell-${entry.key}`}
                      fill={`var(--color-${entry.key.toLowerCase()})`}
                      stroke="transparent"
                    />
                  ))}
                  {statusCounts.length === 1 && (
                    <Label position="center" content={renderCustomizedLabel} />
                  )}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} candidates`]}
                  contentStyle={{
                    backgroundColor: "var(--accent)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: "20px" }}
                  formatter={(value, entry) => {
                    // Type casting to access our custom payload properties
                    const customPayload = entry.payload as unknown as ChartDataItem;
                    return customPayload ? (
                      <span className="text-muted-foreground text-xs">
                        {value}: {customPayload.percentage}%
                      </span>
                    ) : null;
                  }}
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No candidate data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateStatusOverview;
