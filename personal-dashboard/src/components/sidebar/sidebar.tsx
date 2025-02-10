import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import Dashboard from "../dashboard/dashboard.tsx";

const today = new Date().toLocaleDateString();

export default function Sidebar() {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="m-6 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex flex-col items-start gap-2">
            {/*Button to toggle Sidebar  */}
            {/* <SidebarTrigger className="-ml-1" /> */}
            <a className="text-xlrg font-bold">Hey, Harry</a>
            <div className="flex flex-row gap-2">
              <a className="text-sml font-light">{today}</a>
              <Separator orientation="vertical" className="h-6" />
              <a className="text-sml font-light">{time}</a>
            </div>
          </div>
        </header>
        <Dashboard />
      </SidebarInset>
    </SidebarProvider>
  );
}
