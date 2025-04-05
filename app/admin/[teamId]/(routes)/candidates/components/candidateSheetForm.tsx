"use client";

import { DatePickerWithLabel } from "@/components/common/date-picker-with-label";
import { InputWithLabel } from "@/components/common/input-with-label";
import { SelectWithLabel } from "@/components/common/select-with-label";
import { SkillsSelector } from "@/components/common/skills-selector";
import { TextareaWithLabel } from "@/components/common/textarea-with-label";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { UserType } from "@/drizzle/schema/auth";
import type { CandidateSchemaType } from "@/lib/validator/ui-validator";
import { Loader2 } from "lucide-react";
import { memo } from "react";
import type { UseFormReturn } from "react-hook-form";

type SelectOption = {
  value: string;
  label: string;
};

interface CandidateSheetFormProps {
  form: UseFormReturn<CandidateSchemaType>;
  isLoading: boolean;
  serverError: string | null;
  associates: UserType[] | null;
  teamId: string;
  isNewCandidate: boolean;
  onSubmit: (data: CandidateSchemaType) => Promise<void>;
  onCancel: () => void;
}

const CandidateSheetForm = memo(function CandidateSheetForm({
  form,
  isLoading,
  serverError,
  associates,
  teamId,
  isNewCandidate,
  onSubmit,
  onCancel,
}: CandidateSheetFormProps) {
  return (
    <Form {...form}>
      {serverError && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-destructive text-sm">
          {serverError}
        </div>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputWithLabel
            fieldTitle="Name"
            disabled={isLoading}
            nameInSchema="name"
            placeholder="Candidate Name"
          />

          <InputWithLabel
            type="email"
            fieldTitle="Email"
            disabled={isLoading}
            nameInSchema="email"
            placeholder="Email"
          />

          <InputWithLabel
            type="tel"
            fieldTitle="Phone Number"
            disabled={isLoading}
            nameInSchema="phone"
            placeholder="Phone Number"
          />

          <DatePickerWithLabel
            fieldTitle="Onboarding Date"
            disabled={isLoading}
            nameInSchema="onboardingDate"
            placeholder="Select onboarding date"
          />

          <InputWithLabel
            type="number"
            fieldTitle="Years of Experience"
            disabled={isLoading}
            nameInSchema="yearsOfExperience"
            placeholder="Years of Experience"
          />

          <InputWithLabel
            fieldTitle="Resume URL"
            disabled={isLoading}
            nameInSchema="resumeUrl"
            placeholder="Resume URL"
          />

          <InputWithLabel
            fieldTitle="Designation"
            disabled={isLoading}
            nameInSchema="designation"
            placeholder="Designation"
          />

          <SelectWithLabel
            fieldTitle="Assessor Name"
            disabled={isLoading}
            nameInSchema="assignedAssessorId"
            placeholder="Assign assessor"
            options={
              associates?.map(
                (associate): SelectOption => ({
                  value: associate.id,
                  label: associate.name || "",
                }),
              ) ?? []
            }
          />

          <SelectWithLabel
            fieldTitle="Groomer Name"
            disabled={isLoading}
            nameInSchema="assignedGroomerId"
            placeholder="Assign groomer"
            options={
              associates?.map(
                (associate): SelectOption => ({
                  value: associate.id,
                  label: associate.name || "",
                }),
              ) ?? []
            }
          />
        </div>

        <div className="w-full">
          <SkillsSelector
            teamId={teamId}
            nameInSchema="skills"
            fieldTitle="Candidate Skills"
            placeholder="Select technologies..."
            disabled={isLoading}
          />
        </div>

        <TextareaWithLabel
          fieldTitle="Notes"
          disabled={isLoading}
          nameInSchema="notes"
          placeholder="Additional notes about the candidate"
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="min-w-24"
          >
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit" className="min-w-24 bg-primary">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </>
            ) : isNewCandidate ? (
              "Create"
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
});

export default CandidateSheetForm;
