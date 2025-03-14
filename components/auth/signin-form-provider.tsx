import CardWrapper from "./card-wrapper";
import { SignInForm } from "./signin-form";

const SignInFormProvider = () => {
  return (
    <CardWrapper
      headerLabel="Sign in to your account using email"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/sign-up"
    >
      <SignInForm />
    </CardWrapper>
  );
};

export default SignInFormProvider;
