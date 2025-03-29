import Loader from "@/components/common/loader";
import { validateUserTeam } from "@/data/helper/teams.helper";
import { Suspense } from "react";
import TeamCheck from "./components/team-check";

const TeamSetupPage = async () => {
  const { team } = await validateUserTeam();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <TeamCheck team={team} />
      </Suspense>
    </>
  );
};

export default TeamSetupPage;
