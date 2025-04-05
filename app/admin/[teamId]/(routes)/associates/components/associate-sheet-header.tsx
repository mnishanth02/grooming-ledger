"use client";

import { Button } from "@/components/ui/button";
import { Eye, Trash } from "lucide-react";
import type { AssociateColumn } from "./columns";

interface AssociateSheetHeaderProps {
  associate?: AssociateColumn;
  onDelete: () => void;
  onViewFullProfile: () => void;
}

const AssociateSheetHeader = ({
  associate,
  onDelete,
  onViewFullProfile,
}: AssociateSheetHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="font-semibold text-xl">
          {associate ? associate.name : "Associate Details"}
        </h2>
        {associate && <p className="text-muted-foreground text-sm">{associate.email}</p>}
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="icon" onClick={onViewFullProfile} title="View Full Profile">
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onDelete}
          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          title="Delete Associate"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AssociateSheetHeader;
