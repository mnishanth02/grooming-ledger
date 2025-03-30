"use client";
import { DatePickerWithLabel } from "@/app/components/common/date-picker-with-label";
import { InputWithLabel } from "@/components/common/input-with-label";
import PageHeading from "@/components/common/page-heading";
import { SelectWithLabel } from "@/components/common/select-with-label";
import { TextareaWithLabel } from "@/components/common/textarea-with-label";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { createCandidate, deleteCandidate, updateCandidate } from "@/data/actions/candidate.action";
import type { UserType } from "@/drizzle/schema/auth";
import type { CandidateType } from "@/drizzle/schema/grooming";
import { CandidateSchema, type CandidateSchemaType } from "@/lib/validator/ui-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Candidaterops {
  initialData: CandidateType | null;
  associates: UserType[] | null;
}

const CandidateForm = ({ initialData, associates }: Candidaterops) => {
  const router = useRouter();
  const params = useParams();

  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const pageTitle = initialData ? "Edit Candidate" : "Create Candidate";
  const pageDescription = initialData ? "Edit Candidate" : "Add a new Candidate";
  const toastMessage = initialData ? "Candidate updated." : "Candidate created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<CandidateSchemaType>({
    resolver: zodResolver(CandidateSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone ?? "",
          onboardingDate: initialData.onboardingDate ?? "",
          resumeUrl: initialData.resumeUrl ?? "",
          designation: initialData.designation ?? "",
          yearsOfExperience: initialData.yearsOfExperience ?? 0,
          assignedAssessorId: initialData.assignedAssessorId ?? "",
          assignedGroomerId: initialData.assignedGroomerId ?? "",
          notes: initialData.notes ?? "",
        }
      : {
          name: "",
          email: "",
          phone: "",
          onboardingDate: "",
          yearsOfExperience: 0,
          resumeUrl: "",
          designation: "",
          assignedAssessorId: "",
          assignedGroomerId: "",
          notes: "",
        },
  });

  const { execute: executeCreate } = useAction(createCandidate, {
    onExecute: () => {
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || toastMessage);
      form.reset();
      router.refresh();
    },
    onError: (error) => {
      if (error.error?.serverError) {
        setServerError(error.error.serverError);
        toast.error(error.error.serverError);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateCandidate, {
    onExecute: () => {
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || toastMessage);
      router.push(`/admin/${params.teamId}/candidates`);
      router.refresh();
    },
    onError: (error) => {
      if (error.error?.serverError) {
        setServerError(error.error.serverError);
        toast.error(error.error.serverError);
      } else {
        toast.error("Something went wrong");
      }
    },
  });

  const { execute: executeDelete, isPending: isDeleting } = useAction(deleteCandidate, {
    onExecute: () => {
      setServerError(null);
    },
    onSuccess: (data) => {
      toast.success(data.data?.message || "Candidate deleted successfully");
      router.push(`/admin/${params.teamId}/candidates`);
    },
    onError: (error) => {
      if (error.error?.serverError) {
        setServerError(error.error.serverError);
        toast.error(error.error.serverError);
      } else {
        toast.error("Something went wrong");
      }
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const onSubmit = async (data: CandidateSchemaType) => {
    setServerError(null);

    const submitData = {
      name: data.name,
      teamId: params.teamId as string,
      email: data.email,
      phone: data.phone,
      onboardingDate: data.onboardingDate,
      yearsOfExperience: Number(data.yearsOfExperience),
      resumeUrl: data.resumeUrl,
      designation: data.designation ?? "",
      assignedAssessorId: data.assignedAssessorId,
      assignedGroomerId: data.assignedGroomerId,
      notes: data.notes,
    };

    if (initialData) {
      await executeUpdate({
        ...submitData,
        candidateId: initialData?.id || "",
      });
    } else {
      await executeCreate(submitData);
    }
  };

  const onDelete = () => {
    executeDelete({
      candidateId: initialData?.id ?? "",
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isDeleting}
      />
      <div className="flex-between">
        <PageHeading title={pageTitle} description={pageDescription} />

        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            disabled={isUpdating || isDeleting}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator className="" />
      {serverError && (
        <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
          {serverError}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-3">
            <InputWithLabel
              fieldTitle="Name"
              disabled={isUpdating || isDeleting}
              nameInSchema="name"
              placeholder="Candidate Name"
            />

            <InputWithLabel
              type="email"
              fieldTitle="Email"
              disabled={isUpdating || isDeleting}
              nameInSchema="email"
              placeholder="Email"
            />

            <InputWithLabel
              type="number"
              fieldTitle="Phone Number"
              disabled={isUpdating || isDeleting}
              nameInSchema="phone"
              placeholder="Phone Number"
            />

            <DatePickerWithLabel
              fieldTitle="Onboarding Date"
              disabled={isUpdating || isDeleting}
              nameInSchema="onboardingDate"
              placeholder="Select onboarding date"
            />

            <InputWithLabel
              type="number"
              fieldTitle="Years of Experience"
              disabled={isUpdating || isDeleting}
              nameInSchema="yearsOfExperience"
              placeholder="Years of Experience"
            />

            <InputWithLabel
              fieldTitle="Resume URL"
              disabled={isUpdating || isDeleting}
              nameInSchema="resumeUrl"
              placeholder="Resume URL"
            />
            <InputWithLabel
              fieldTitle="Designation"
              disabled={isUpdating || isDeleting}
              nameInSchema="designation"
              placeholder="Designation"
            />

            <SelectWithLabel
              fieldTitle="Assessor Name"
              disabled={isUpdating || isDeleting}
              nameInSchema="assignedAssessorId"
              placeholder="Assign assessor"
              options={
                associates?.map((associate) => ({
                  value: associate.id,
                  label: associate.name,
                })) ?? []
              }
            />

            <SelectWithLabel
              fieldTitle="Groomer Name"
              disabled={isUpdating || isDeleting}
              nameInSchema="assignedGroomerId"
              placeholder="Assign groomer"
              options={
                associates?.map((associate) => ({
                  value: associate.id,
                  label: associate.name,
                })) ?? []
              }
            />

            <TextareaWithLabel
              fieldTitle="Notes"
              disabled={isUpdating || isDeleting}
              nameInSchema="notes"
              placeholder="Notes"
            />
          </div>
          <Button type="submit" disabled={isUpdating || isDeleting}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>{action}</>
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CandidateForm;
