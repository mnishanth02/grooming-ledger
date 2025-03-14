import Footer from "@/components/common/footer";
import Loader from "@/components/common/loader";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Header } from "@/components/sidebar/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { Suspense } from "react";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    return <Loader />;
  }

  return (
    <SidebarProvider>
      <Suspense fallback={<Loader />}>
        <AppSidebar user={session.user} />
      </Suspense>
      <SidebarInset>
        <Suspense fallback={<Loader />}>
          <Header />
        </Suspense>
        <div className="flex-1">{children}</div>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
