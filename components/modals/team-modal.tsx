"use client";

import { InputWithLabel } from "@/components/common/input-with-label";
import { createTeam } from "@/data/actions/team.action";
import { useTeamModal } from "@/hooks/store/use-team-modal";
import { TeamSchema, type TeamSchemaType } from "@/lib/validator/ui-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TextareaWithLabel } from "../common/textarea-with-label";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Modal } from "../ui/modal";

const TeamModal = () => {
  const { isOpen, onClose } = useTeamModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<TeamSchemaType>({
    resolver: zodResolver(TeamSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { execute } = useAction(createTeam, {
    onExecute: () => {
      setIsSubmitting(true);
      setServerError(null);
    },
    onSuccess: ({ data }) => {
      toast.success(data?.message || "Team created successfully");
      form.reset();
      onClose();

      // Navigate to the new team
      if (data?.team?.id) {
        window.location.assign(`/admin/${data.team.id}`);
      } else {
        // Fallback to refresh the page if we can't get the team ID
        window.location.reload();
      }
    },
    onError: ({ error }) => {
      if (error?.serverError) {
        setServerError(error.serverError);
        toast.error(error.serverError);
      } else {
        toast.error("Something went wrong");
      }
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (values: TeamSchemaType) => {
    execute(values);
  };

  return (
    <Modal
      title="Create Team"
      description="Add a new team to categorize your grooming "
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        {serverError && (
          <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
            {serverError}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputWithLabel
              fieldTitle="Name"
              disabled={isSubmitting}
              nameInSchema="name"
              placeholder="Team Name"
            />
            <TextareaWithLabel
              fieldTitle="Description"
              disabled={isSubmitting}
              nameInSchema="description"
              placeholder="Team Description"
            />
            <div className="flex items-center justify-end gap-x-2 pt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Loading..." : "Continue"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default TeamModal;
