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
    <div className=" mx-auto flex flex-col items-center px-28">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Badge variant="outline" className="mb-2">
                  Enterprise Solution
                </Badge>
                <h1 className="font-bold text-3xl tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Grooming Hub
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Track and manage the entire grooming lifecycle of newly onboarded candidates until
                  they're ready for client projects.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/auth/sign-in">
                  <Button size="lg" className="w-full min-[400px]:w-auto">
                    Login to Platform
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              {/* Placeholder for image */}
              <div className="flex h-[350px] w-full items-center justify-center rounded-lg border border-muted bg-muted/30">
                <p className="text-muted-foreground">Grooming Hub Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-4" />

      {/* Features Section */}
      <section className=" container w-full py-12 md:py-24 lg:py-32">
        <div className=" px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="font-bold text-3xl tracking-tighter sm:text-5xl">Key Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to manage the grooming lifecycle of your candidates
              </p>
            </div>
          </div>

          <Tabs defaultValue="tracking" className="mx-auto mt-8 max-w-5xl">
            <TabsList className="mb-8 grid w-full grid-cols-3">
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
            </TabsList>
            <TabsContent value="tracking" className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Comprehensive Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Track the entire grooming lifecycle from onboarding to project placement with
                    detailed progress metrics.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Candidate Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Quickly find any candidate and check their current status in the grooming
                    lifecycle.
                  </CardDescription>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="assessment" className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Structured Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Organize assessments across four key categories: Assessment feedback (30%),
                    Generic Topics (40%), Programming (20%), and Previous interview questions (10%).
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Feedback Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Capture, organize, and review all comments and feedback throughout the grooming
                    process.
                  </CardDescription>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="management" className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Role-Based Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Tailored interfaces for Project Managers and Associates with appropriate
                    permissions and workflows.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Secure Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
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
      <section className=" container w-full bg-muted/30 py-12 md:py-24 lg:py-32">
        <div className=" px-4 md:px-6">
          <Card className="mx-auto max-w-4xl border-none bg-transparent">
            <CardContent className="flex flex-col items-center justify-center space-y-6 p-8 text-center">
              <div className="flex flex-col items-center space-y-2 ">
                <h2 className="font-bold text-3xl tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to streamline your grooming process?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Login to the Grooming Hub platform to start managing your candidates' grooming
                  lifecycle.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/auth/sign-in">
                  <Button size="lg" className="w-full min-[400px]:w-auto">
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
