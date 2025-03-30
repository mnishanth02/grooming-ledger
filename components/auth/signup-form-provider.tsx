import { getAllTeams } from "@/data/data-access/team.queries";
import CardWrapper from "./card-wrapper";
import { SignUpForm } from "./signup-form";

const SignUpFormProvider = async () => {
  const teams = await getAllTeams();
  return (
    <CardWrapper
      headerLabel="Sign up to PwC Grooming Hub"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/sign-in"
    >
      <SignUpForm teams={teams.success && teams.data ? teams.data : []} />
    </CardWrapper>
  );
};

export default SignUpFormProvider;
