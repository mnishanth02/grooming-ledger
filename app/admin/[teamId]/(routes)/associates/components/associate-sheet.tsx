"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { UserType } from "@/drizzle/schema/auth";
import type { OptionType } from "@/lib/validator/ui-validator";
import { useParams, useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";
import { toast } from "sonner";
import AssociateSheetHeader from "./associate-sheet-header";
import AssociateSheetView from "./associate-sheet-view";
import type { AssociateColumn } from "./columns";

// Extended user type with additional properties
interface ExtendedUserType extends UserType {
  candidatesAssignedAsAssessor?: {
    id: string;
    name: string;
    email: string;
    status: string;
  }[];
  candidatesAssignedAsGroomer?: {
    id: string;
    name: string;
    email: string;
    status: string;
  }[];
  skills?: OptionType[];
}

interface AssociateSheetProps {
  isOpen: boolean;
  onClose: () => void;
  associate?: AssociateColumn;
  fullData?: ExtendedUserType | null;
}

const AssociateSheet = memo(function AssociateSheet({
  isOpen,
  onClose,
  associate,
  fullData = null,
}: AssociateSheetProps) {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId as string;

  // UI state
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Event handlers
  const handleViewFullProfile = useCallback(() => {
    if (associate) {
      router.push(`/admin/${teamId}/associates/${associate.id}`);
    }
  }, [associate, router, teamId]);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteAlert(true);
  }, []);

  const handleDelete = useCallback(() => {
    // This would be implemented if delete functionality is needed
    toast.success("Associate deleted successfully");
    setShowDeleteAlert(false);
    onClose();
    router.refresh();
  }, [onClose, router]);

  return (
    <>
      <AlertModal
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={handleDelete}
        loading={false}
      />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-full max-w-md overflow-y-auto border-l p-5 sm:max-w-xl"
        >
          <SheetTitle hidden />
          <AssociateSheetHeader
            associate={associate}
            onDelete={handleDeleteClick}
            onViewFullProfile={handleViewFullProfile}
          />

          <Separator className="mb-2" />

          {associate ? (
            <AssociateSheetView
              associate={associate}
              fullData={fullData}
              onViewFullProfile={handleViewFullProfile}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
});

export default AssociateSheet;
