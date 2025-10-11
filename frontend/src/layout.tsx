
import { NavLink, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "./components/Header";
import ToggleSwitch from "./components/ToggleSwitch";

const AppLayout = () => {
  return (
    <SidebarProvider className="bg-zinc-950 ">
      <AppSidebar />
      <div className="w-full relative isolate ">
        <Header className="sticky top-0 z-50  shadow-md bg-sidebar px-4 w-full">
          <div>
            <SidebarTrigger className="size-9" />
          </div>
          {/* <div>
                <ToggleSwitch/>
            </div> */}
        </Header>
        <main className="bg-sidebar overflow-y-auto min-h-[calc(100svh-36px)]">
          {<Outlet />}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
