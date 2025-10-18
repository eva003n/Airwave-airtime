import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import logoImage from "/images/Airwave-logo.png";

import { CardSim, LayoutDashboard,LogOut, Plus, Settings, UserPlus, Wallet } from "lucide-react";
import Logo from "./Logo";
import { Link } from "react-router-dom";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Recipients",
    url: "/recipients",
    icon: UserPlus,
  },
  {
    title: "Top ups",
    url: "/top-ups",
    icon: CardSim,
  },
  {
    title: "Wallet",
    url: "/wallet",
    icon: Wallet
  },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  // },
];


export function AppSidebar() {
    const {open} = useSidebar()
  return (
    <Sidebar  collapsible="icon">
      <SidebarContent>
        <SidebarHeader className="px-0 py-4">
          <div className="flex gap-1 items-center">
            <div>
              <img src={logoImage} width={50} />
            </div>
            <Link
              to="/"
              className={` text-2xl text-color font-bold text-color tracking-wider ${
                open ? "md:block" : "hidden"
              }`}
            >
              Airwave
              <p className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                airtime
              </p>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarGroup />

        <SidebarGroupContent>
          <SidebarMenu className={`${!open && "items-center"}`}>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
        <SidebarMenuAction>
        </SidebarMenuAction>
      </SidebarContent>
    </Sidebar>
  );
}
