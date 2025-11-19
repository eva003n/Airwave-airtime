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

import { AlarmCheckIcon, BadgeDollarSign, Book, CardSim, LayoutDashboard,LogOut, Plus, Settings, Settings2, UserPlus, Users2, Wallet } from "lucide-react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fa } from "zod/v4/locales";
import { getItem } from "@/utils";
import type { UserData } from "@/validation/validators";

const ADMINLINKS = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users2,
  },
  {
    title: "Transactions",
    url: "/admin/transactions",
    icon: BadgeDollarSign,
  },
  {
    title: "Ledger",
    url: "/admin/ledger",
    icon: Book,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings2,
  },
];

const USERLINKS = [
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
    title: "Jobs",
    url: "/top-ups/bulk",
    icon: AlarmCheckIcon,
  },
  {
    title: "Wallet",
    url: "/wallet",
    icon: Wallet,
  },
];




export function AppSidebar() {
  const { open, setOpen } = useSidebar();
  const [isOpen, setIsOpen] = useState(() => {
    // ✅ Read localStorage once, during initial mount
    const saved = localStorage.getItem("sidebarOpen");
    return saved === null ? true : saved === "true";
  });

  const user = getItem<UserData>("user");
  const items = user && user?.role === "user" || user?.role === "test" ? USERLINKS : ADMINLINKS;



useEffect(() => {
  // ✅ Write only when value actually changes
  localStorage.setItem("sidebarOpen", String(isOpen));
}, [isOpen]);
  return (
    <Sidebar collapsible="icon" >
      <SidebarContent className="bg-white">
        <SidebarHeader className="px-0 py-4 ">
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
              <SidebarMenuItem key={item.title} title={item.title}>
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
        <SidebarMenuAction></SidebarMenuAction>
      </SidebarContent>
    </Sidebar>
  );
}
