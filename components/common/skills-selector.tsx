"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MultipleSelector, type Option } from "@/components/ui/multiple-selector";
import { getTopicOptions } from "@/data/actions/topic.actions";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface SkillsSelectorProps {
  teamId: string;
  nameInSchema: string;
  fieldTitle: string;
  placeholder?: string;
  disabled?: boolean;
}

export function SkillsSelector({
  teamId,
  nameInSchema,
  fieldTitle,
  placeholder = "Select skills...",
  disabled = false,
}: SkillsSelectorProps) {
  const [skills, setSkills] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const form = useFormContext();

  const { execute } = useAction(getTopicOptions, {
    onExecute: () => {
      setIsLoading(true);
    },
    onSuccess: ({ data }) => {
      if (data?.data) {
        setSkills(data.data);
      }
    },
    onError: ({ error }) => {
      console.error("Failed to fetch skills:", error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (teamId) {
      execute({ teamId });
    }
  }, [teamId, execute]);

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{fieldTitle}</FormLabel>
          <FormControl>
            <div>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-muted-foreground text-sm">Loading skills...</span>
                </div>
              ) : (
                <MultipleSelector
                  placeholder={placeholder}
                  defaultOptions={skills}
                  groupBy="category"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                  className="w-full"
                />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
