import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="wrapper flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32 xl:py-48">
        {/* Background gradient elements */}
        <div className="-top-24 -left-24 absolute h-96 w-96 animate-pulse rounded-full bg-primary/10 opacity-70 blur-3xl" />
        <div className="-bottom-24 -right-24 absolute h-96 w-96 animate-pulse rounded-full bg-secondary/10 opacity-70 blur-3xl" />

        <div className="relative z-10 px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <Badge variant="outline" className="mb-2 animate-fade-in">
                  Enterprise Solution
                </Badge>
                <h1 className="font-bold text-3xl tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  <span className="app-name block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                    Grooming Hub
                  </span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground leading-relaxed md:text-xl">
                  Track and manage the entire grooming lifecycle of newly onboarded candidates until
                  they're ready for client projects.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-4 min-[400px]:flex-row">
                <Link href="/auth/sign-in">
                  <Button
                    size="lg"
                    className="hover:-translate-y-1 w-full bg-primary shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl min-[400px]:w-auto"
                  >
                    Login to Platform
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              {/* Simple dashboard preview */}
              <div className="relative w-full max-w-[400px] xl:max-w-[500px]">
                {/* Simple browser window mockup */}
                <div className="relative h-[350px] overflow-hidden rounded-lg border border-muted bg-card shadow-xl ring-1 ring-muted/20">
                  {/* Browser chrome */}
                  <div className="flex h-8 items-center border-muted/50 border-b bg-muted/30 px-3">
                    <div className="flex space-x-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                    </div>
                    <div className="mx-auto font-medium text-muted-foreground text-xs">
                      Grooming Hub Dashboard
                    </div>
                  </div>
                  {/* Dashboard content */}
                  <div className="relative p-4">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                    <div className="relative mb-4 h-6 w-3/4 rounded bg-muted/40" />
                    <div className="relative space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="h-24 animate-pulse rounded bg-primary/10" />
                        <div className="h-24 animate-pulse rounded bg-secondary/10 delay-300" />
                      </div>
                      <div className="h-32 animate-pulse rounded bg-muted/30 delay-500" />
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-16 animate-pulse rounded bg-primary/5 delay-700" />
                        <div className="h-16 animate-pulse rounded bg-primary/10 delay-800" />
                        <div className="h-16 animate-pulse rounded bg-primary/15 delay-900" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-4" />

      {/* Features Section */}
      <section className="container relative w-full overflow-hidden py-12 md:py-24 lg:py-32">
        {/* Background elements */}
        <div className="absolute top-20 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 left-0 h-64 w-64 rounded-full bg-secondary/5 blur-3xl" />

        <div className="relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-3">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-sm">
                Platform Features
              </span>
              <h2 className="font-bold text-3xl tracking-tighter sm:text-5xl">Key Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to manage the grooming lifecycle of your candidates
              </p>
            </div>
          </div>

          <Tabs defaultValue="tracking" className="mx-auto mt-12 max-w-5xl">
            <TabsList className="mb-10 grid w-full grid-cols-3 bg-muted/50 p-1">
              <TabsTrigger value="tracking" className="font-medium text-sm sm:text-base">
                Tracking
              </TabsTrigger>
              <TabsTrigger value="assessment" className="font-medium text-sm sm:text-base">
                Assessment
              </TabsTrigger>
              <TabsTrigger value="management" className="font-medium text-sm sm:text-base">
                Management
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tracking" className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="group overflow-hidden border-muted/60 transition-all duration-300 hover:border-primary/50 hover:shadow-md">
                <CardHeader className="bg-muted/10 pb-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl">Comprehensive Tracking</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className="text-base">
                    Track the entire grooming lifecycle from onboarding to project placement with
                    detailed progress metrics.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="group overflow-hidden border-muted/60 transition-all duration-300 hover:border-primary/50 hover:shadow-md">
                <CardHeader className="bg-muted/10 pb-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl">Candidate Search</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className="text-base">
                    Quickly find any candidate and check their current status in the grooming
                    lifecycle.
                  </CardDescription>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="assessment" className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="group overflow-hidden border-muted/60 transition-all duration-300 hover:border-primary/50 hover:shadow-md">
                <CardHeader className="bg-muted/10 pb-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl">Structured Assessment</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className="text-base">
                    Organize assessments across four key categories: Assessment feedback (30%),
                    Generic Topics (40%), Programming (20%), and Previous interview questions (10%).
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="group overflow-hidden border-muted/60 transition-all duration-300 hover:border-primary/50 hover:shadow-md">
                <CardHeader className="bg-muted/10 pb-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl">Feedback Management</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className="text-base">
                    Capture, organize, and review all comments and feedback throughout the grooming
                    process.
                  </CardDescription>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="management" className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="group overflow-hidden border-muted/60 transition-all duration-300 hover:border-primary/50 hover:shadow-md">
                <CardHeader className="bg-muted/10 pb-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl">Role-Based Access</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className="text-base">
                    Tailored interfaces for Project Managers and Associates with appropriate
                    permissions and workflows.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="group overflow-hidden border-muted/60 transition-all duration-300 hover:border-primary/50 hover:shadow-md">
                <CardHeader className="bg-muted/10 pb-4">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <CardTitle className="text-xl">Secure Access</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className="text-base">
                    Login restricted to company email addresses, ensuring data security and
                    appropriate access control.
                  </CardDescription>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Separator className="my-4" />

      {/* Roles Section */}
      <section className=" containerw-full bg-muted/30 py-12 md:py-24 lg:py-32">
        <div className=" px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="font-bold text-3xl tracking-tighter sm:text-5xl">Platform Roles</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Grooming Hub supports different roles with specific responsibilities
              </p>
            </div>
          </div>
          <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-16 w-16 border-4 border-primary/10">
                  <AvatarFallback className="bg-primary font-bold text-primary-foreground text-xl">
                    PM
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Project Manager</CardTitle>
                  <CardDescription>Oversees the grooming process</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Project Managers add new candidates to the platform, assign assessors and
                  groomers, and oversee the entire grooming process to ensure candidates are ready
                  for client projects.
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-16 w-16 border-4 border-secondary/10">
                  <AvatarFallback className="bg-secondary font-bold text-secondary-foreground text-xl">
                    AS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Associate</CardTitle>
                  <CardDescription>Assessor/Groomer</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Associates serve as assessors or groomers for candidates, providing feedback,
                  conducting training sessions, and evaluating readiness for client projects.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="my-4" />

      {/* Process Section */}
      <section className=" container w-full py-12 md:py-24 lg:py-32">
        <div className=" px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="font-bold text-3xl tracking-tighter sm:text-5xl">
                Grooming Lifecycle
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A structured 15-20 day process to prepare candidates for client projects
              </p>
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-semibold text-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      1
                    </div>
                    <span>Candidate Onboarding</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-14">
                  <p className="text-muted-foreground">
                    New candidates are added to the platform by Project Managers with all relevant
                    details. This includes personal information, skills, experience, and educational
                    background.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="font-semibold text-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      2
                    </div>
                    <span>Assessor & Groomer Assignment</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-14">
                  <p className="text-muted-foreground">
                    PM assigns appropriate associates as assessors and groomers for each candidate
                    based on skills, experience, and availability. Associates can serve as assessors
                    or groomers for different candidates.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="font-semibold text-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      3
                    </div>
                    <span>Structured Assessment</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-14">
                  <p className="text-muted-foreground">
                    Candidates undergo assessment across four key areas: Assessment feedback topics
                    (30%), Generic Topics (40%), Programming (20%), and Previous interview questions
                    (10%). This comprehensive approach ensures all aspects of a candidate's skills
                    are evaluated.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="font-semibold text-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      4
                    </div>
                    <span>Continuous Feedback</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-14">
                  <p className="text-muted-foreground">
                    Throughout the process, assessors and groomers provide detailed feedback that is
                    tracked in the platform. This feedback helps identify areas for improvement and
                    track progress over time.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="font-semibold text-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      5
                    </div>
                    <span>Project Placement</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-14">
                  <p className="text-muted-foreground">
                    After successful completion of the grooming lifecycle, candidates are placed in
                    appropriate client projects based on their skills, performance during grooming,
                    and project requirements.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <Separator className="my-4" />

      {/* CTA Section */}
      <section className="container relative w-full overflow-hidden bg-muted/30 py-12 md:py-24 lg:py-32">
        {/* Background elements */}
        <div className="-top-20 -right-20 absolute h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="-bottom-20 -left-20 absolute h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />

        <div className="relative z-10 px-4 md:px-6">
          <Card className="mx-auto max-w-4xl border-none bg-transparent">
            <CardContent className="flex flex-col items-center justify-center space-y-8 p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <span className="inline-block rounded-full bg-primary/10 px-4 py-1 font-medium text-primary text-sm">
                  Get Started Today
                </span>
                <h2 className="font-bold text-3xl tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to streamline your grooming process?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Login to the Grooming Hub platform to start managing your candidates' grooming
                  lifecycle.
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-4 min-[400px]:flex-row">
                <Link href="/auth/sign-in">
                  <Button
                    size="lg"
                    className="hover:-translate-y-1 w-full bg-primary shadow-lg transition-all duration-300 hover:bg-primary/90 hover:shadow-xl min-[400px]:w-auto"
                  >
                    Login Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
