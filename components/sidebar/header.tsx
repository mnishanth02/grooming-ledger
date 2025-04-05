import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "../common/theme-toggle";
import { SidebarTrigger } from "../ui/sidebar";
import { BreadCrumTitle } from "./breadcrum-title";
import SearchCommand from "./search-command";

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-1 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sm:gap-2">
      <div className="flex w-full items-center justify-between gap-1 px-2 sm:gap-2 sm:px-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-1 hidden data-[orientation=vertical]:h-4 sm:mr-2 sm:flex"
          />
          <Breadcrumb className="max-w-[120px] truncate sm:max-w-full">
            <BreadcrumbList>
              <BreadcrumbItem className="hidden sm:block">
                <BreadcrumbLink href="/admin"> Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadCrumTitle />
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {/* <div className="flex-grow px-1 sm:px-2 md:px-4">
        </div> */}
        <div className="flex items-center gap-4 ">
          <SearchCommand />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
