
import { Link, NavLink, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "./components/Header";
import ToggleSwitch from "./components/ToggleSwitch";
import { LogOut } from "lucide-react";
import type { Id } from "./validation/validators";
import { useAuth } from "./context/authcontext";
import { Button } from "./components/ui/button";

const AppLayout = () => {
  const {logOut} = useAuth()

  const handleLogOut = async () => {
    await logOut()

  }
  return (
    <SidebarProvider className="bg-zinc-950 ">
      <AppSidebar />
      <div className="w-full relative isolate ">
        <Header className="sticky top-0 z-50  shadow-md bg-sidebar px-4 w-full flex justify-between">
          <div>
            <SidebarTrigger className="size-9" />
          </div>
          <Button  variant="outline"onClick={handleLogOut} className="flex gap-2 items-center">
            <LogOut size={16}/> <span className="text-[.9rem] font-medium hover:underline ">Log out</span>
          </Button>
          {/* <div>
                <ToggleSwitch/>
            </div> */}
        </Header>
        <main className="bg-sidebar overflow-y-auto min-h-[calc(100svh-36px)]   ">
          {<Outlet />}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
