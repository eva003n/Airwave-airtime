
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "./components/Header";
import ToggleSwitch from "./components/ToggleSwitch";
import { LogOut } from "lucide-react";
import type { Id, UserData } from "./validation/validators";
import { useAuth } from "./context/authcontext";
import { Button } from "./components/ui/button";
import { useState } from "react";
import ModeSwitch from "./components/ModeSwitch";
import { useEnv } from "./context/Environment/env.context";
import { getItem } from "./utils";

// const user = getItem<UserData>("user")
// console.log(user)
const AppLayout = () => {
  const {logOut, user} = useAuth()
    const { enabled } = useEnv();

  const [open, setOpen] = useState<boolean>(() => {
    // Load from localStorage on mount
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebarOpen") === "true";
    }
    return true; // default open
  });
  const handleLogOut = async () => {
    await logOut()

  }

    const handleOpenChange = (next: boolean) => {
      setOpen(next);
      localStorage.setItem("sidebarOpen", String(next)); // Save
    };
  return (
    <SidebarProvider
      className="bg-zinc-950 "
      open={open}
      onOpenChange={handleOpenChange}
    >
      <AppSidebar />
      <div className="w-full relative isolate ">
        <Header className="sticky top-0 z-50   shadow-md bg-white px-4 w-full flex justify-between">
          <div>
            <SidebarTrigger className="size-9" />
          </div>

          <div className="flex gap-6 items-center">
            {user && user.role !== "user"  && (
              <div>
                <ModeSwitch />
              </div>
            )}
            <Button
              variant="ghost"
              onClick={handleLogOut}
              className="flex gap-2 items-center cursor-pointer"
            >
              <LogOut size={16} />{" "}
              <span className="text-[.9rem] font-medium hover:underline ">
                Log out
              </span>
            </Button>
          </div>
        </Header>
        <main className="bg-sidebar overflow-y-auto min-h-[calc(100svh-36px)]   ">
          {<Outlet />}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
