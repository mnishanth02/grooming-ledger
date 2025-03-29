import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="font-bold text-4xl">Grooming Hub </h1>
      <p className="text-lg">
        Grooming Hub is a platform that helps you manage your grooming lifecycle.
      </p>
      <Link className={cn(buttonVariants({ variant: "default" }), "mt-4")} href="/auth/sign-in">
        Login
      </Link>
    </div>
  );
}
