import Header from "../components/Header";
import ListContainer from "../components/ListContainer";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";
import List from "../components/List";
import { NavLink, Outlet } from "react-router-dom";
import Avatar from "../components/Avatar";
import ToggleSwitch from "../components/ToggleSwitch";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const  AppLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <main>{<Outlet />}</main>
    </SidebarProvider>
  );
}

export default AppLayout