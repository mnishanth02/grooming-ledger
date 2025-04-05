"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { createCandidate, deleteCandidate, updateCandidate } from "@/data/actions/candidate.action";
import { CandidateSchema, type CandidateSchemaType } from "@/lib/validator/ui-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useParams, useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { UserType } from "@/drizzle/schema/auth";
import type { CandidateType } from "@/drizzle/schema/grooming";
import type { OptionType } from "@/lib/validator/ui-validator";
import CandidateSheetForm from "./candidateSheetForm";
import CandidateSheetHeader from "./candidateSheetHeader";
import CandidateSheetView from "./candidateSheetView";
import type { CandidateColumn } from "./columns";
import { getDefaultFormValues, prepareSubmitData } from "./utils/candidate-helpers";

interface CandidateSheetProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: CandidateColumn;
  associates?: UserType[] | null;
  fullData?: (CandidateType & { skills?: OptionType[] }) | null;
  isNewCandidate?: boolean;
}

export const CandidateSheet = memo(function CandidateSheet({
  isOpen,
  onClose,
  candidate,
  associates = null,
  fullData = null,
  isNewCandidate = false,
}: CandidateSheetProps) {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;

  // UI state
  const [viewMode, setViewMode] = useState<"view" | "edit">("view");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Form setup
  const form = useForm<CandidateSchemaType>({
    resolver: zodResolver(CandidateSchema),
    defaultValues: getDefaultFormValues(fullData),
    mode: "onChange", // Enable validation on change for better UX
  });

  // Reset view mode when sheet opens/closes and reset form when needed
  useEffect(() => {
    if (!isOpen) {
      // When closing, reset after a delay to prevent visual jumps
      const timer = setTimeout(() => {
        setViewMode("view");
        setServerError(null);
      }, 300);
      return () => clearTimeout(timer);
    }

    // Initial setup for new/existing candidates
    if (isNewCandidate) {
      setViewMode("edit");
      form.reset(getDefaultFormValues(null));
    } else if (isOpen && !viewMode.includes("edit")) {
      // Only set view mode to "view" on initial sheet open, not on subsequent props changes
      setViewMode("view");
    }
  }, [isOpen, isNewCandidate, form, viewMode]);

  // Setup form data when fullData changes and we're in edit mode
  useEffect(() => {
    if (isOpen && viewMode === "edit" && fullData) {
      form.reset(getDefaultFormValues(fullData));
    }
  }, [fullData, viewMode, isOpen, form]);

  // Action hooks
  const { execute: executeCreate, isPending: isCreating } = useAction(createCandidate, {
    onExecute: () => setServerError(null),
    onSuccess: (data) => {
      router.refresh();
      toast.success(data.data?.message || "Candidate created successfully");
      form.reset();
      onClose();
    },
    onError: (error) => {
      const errorMsg = error.error?.serverError || "Something went wrong";
      setServerError(errorMsg);
      toast.error(errorMsg);
    },
  });

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateCandidate, {
    onExecute: () => setServerError(null),
    onSuccess: (data) => {
      toast.success(data.data?.message || "Candidate updated successfully");
      router.refresh();
      setViewMode("view");
    },
    onError: (error) => {
      const errorMsg = error.error?.serverError || "Something went wrong";
      setServerError(errorMsg);
      toast.error(errorMsg);
    },
  });

  const { execute: executeDelete, isPending: isDeleting } = useAction(deleteCandidate, {
    onExecute: () => setServerError(null),
    onSuccess: (data) => {
      toast.success(data.data?.message || "Candidate deleted successfully");
      onClose();
      router.refresh();
    },
    onError: (error) => {
      const errorMsg = error.error?.serverError || "Something went wrong";
      setServerError(errorMsg);
      toast.error(errorMsg);
    },
    onSettled: () => setShowDeleteAlert(false),
  });

  // Event handlers - memoized to prevent unnecessary re-renders
  const handleEditClick = useCallback(() => {
    if (fullData) {
      form.reset(getDefaultFormValues(fullData));
    }
    setViewMode("edit");
  }, [fullData, form]);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteAlert(true);
  }, []);

  const handleViewFullProfile = useCallback(() => {
    if (candidate) {
      router.push(`/admin/${teamId}/candidates/${candidate.id}`);
    }
  }, [candidate, router, teamId]);

  const handleCancelEdit = useCallback(() => {
    if (isNewCandidate) {
      onClose();
    } else {
      setViewMode("view");
    }
  }, [isNewCandidate, onClose]);

  const handleFormSubmit = useCallback(
    async (data: CandidateSchemaType) => {
      setServerError(null);
      const submitData = prepareSubmitData(data, teamId);

      try {
        if (isNewCandidate) {
          await executeCreate(submitData);
        } else if (fullData) {
          await executeUpdate({
            ...submitData,
            candidateId: fullData.id || "",
            onboardingDate: submitData.onboardingDate?.toString() || "",
          });
        }
      } catch (error) {
        // This is handled by the action hooks, but catch here for TypeScript
        console.error("Form submission error:", error);
      }
    },
    [executeCreate, executeUpdate, fullData, isNewCandidate, teamId],
  );

  const handleDelete = useCallback(() => {
    if (fullData) {
      executeDelete({
        candidateId: fullData.id,
        teamId: teamId,
      });
    }
  }, [executeDelete, fullData, teamId]);

  const isLoading = isCreating || isUpdating || isDeleting;

  return (
    <>
      <AlertModal
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-full max-w-md overflow-y-auto border-l p-5 sm:max-w-xl"
        >
          <CandidateSheetHeader
            viewMode={viewMode}
            candidate={candidate}
            isNewCandidate={isNewCandidate}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onViewFullProfile={handleViewFullProfile}
          />

          <Separator className="mb-2" />

          {viewMode === "edit" ? (
            <CandidateSheetForm
              form={form}
              isLoading={isLoading}
              serverError={serverError}
              associates={associates}
              teamId={teamId}
              isNewCandidate={isNewCandidate}
              onSubmit={handleFormSubmit}
              onCancel={handleCancelEdit}
            />
          ) : candidate && fullData ? (
            <CandidateSheetView
              candidate={candidate}
              fullData={fullData}
              onEdit={handleEditClick}
              onViewFullProfile={handleViewFullProfile}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
});
