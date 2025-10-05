
import { NavLink, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "./components/Header";
import ToggleSwitch from "./components/ToggleSwitch";

const AppLayout = () => {
  return (
    <SidebarProvider className="bg-zinc-950">
      <AppSidebar  />
      <div className="w-full relative isolate ">
        <Header className="border-2 bg-sidebar absolute top-0 px-4 w-full">
            <div>
          <SidebarTrigger className="size-9" />

            </div>
            {/* <div>
                <ToggleSwitch/>
            </div> */}
        </Header>
        <main className="bg-sidebar h-svh">{<Outlet />}</main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
