"use client";

import Loader from "@/components/common/loader";
import type { teams } from "@/drizzle/schema/grooming";
import { useTeamModal } from "@/hooks/store/use-team-modal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface TeamCheckProps {
  team: typeof teams.$inferSelect | null | undefined;
}

const TeamCheck = ({ team }: TeamCheckProps) => {
  const { isOpen, onOpen } = useTeamModal();
  const router = useRouter();

  useEffect(() => {
    if (team?.id) {
      router.push(`/admin/${team.id}`);
    } else {
      if (!isOpen) {
        onOpen();
      }
    }
  }, [isOpen, onOpen, team?.id, router]);

  return <Loader fullScreen />;
};

export default TeamCheck;
