import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

import { AppSidebar }
from "./dashboard/components/app-sidebar";
import { SiteHeader } from "./dashboard/components/site-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSidebar />
        

        <SidebarInset className="">
            <div className="p-2 bg-background">
                <SiteHeader/>
          {children}
            </div>
            
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}