// import { NavLink, Link } from "react-router-dom";
// import { animate, AnimatePresence,  motion } from "motion/react";
// import {
//   PanelLeftClose,
//   PanelLeftOpen,
//   LayoutDashboard,
//   Plus,
//   ChartNoAxesColumnIncreasing,
//   ChartLine,
//   LogOut,
//   Settings,
//   Users,
// } from "lucide-react";
// import Button from "./Button";
// import List from "./List";
// import { useAuth } from "../context/authcontext";
// import Avatar from "./Avatar";
// import Notify from "./Notify";
// import { useState } from "react";
// import type { getItem } from "../utils";

// // const _user = JSON.parse(localStorage.getItem("user"));WNB21` `
// const LINK_ITEMS = [
//   {
//     name: "Dashboard",
//     path: "/dashboard",

//     color: "blue",
//     icon: LayoutDashboard,
//   },
//   {
//     name: "Challenges",

//     path: "/challenges",
//     color: "blue",
//     icon: Plus,
//   },
//   // { name: "Activity", path: "/activity  ", color: "blue ", icon: Activity },
//   {
//     name: "Reports",
//     path: "/reports",
//     color: "blue",
//     icon: ChartNoAxesColumnIncreasing,
//   },

//   {
//     name: "Notifications",
//     path: "/notifications",
//     color: "blue",
//     icon: Notify,
//   },
// ];
// const ADMIN_LINKS = [
//   {
//     name: "Dashboard",
//     path: "/admin/dashboard",
//     color: "blue",
//     icon: LayoutDashboard,
//   },
//   { name: "Challenges", path: "/admin/challenges", color: "blue", icon: Plus },
//   // { name: "Analytics", path: "/admin/analytics", color: "blue", icon: ChartLine },
//   { name: "Users", path: "/admin/users", color: "blue", icon: Users },
//   // { name: "Settings", path: "/admin/settings", color: "blue", icon: Settings },
//   // { name: "Notifications", path: "/admin/notifications", color: "blue", icon: Notify },
// ];

// const SideBar = ({}) => {
//   const user = JSON.parse(getItem("user"));
//   const token = localStorage.getItem("token");
//   // const isOpen = JSON.parse(localStorage.getItem("isOpen"));
//   const [isOpen, setIsOpen] = useState(() => {
//     return JSON.parse(getItem("isOpen"));
//   });
//   const LINKS = user && user.role === "admin" ? ADMIN_LINKS : LINK_ITEMS;
//   const { logOut } = useAuth();

//   const handleClick = async () => {
//     await logOut();
//   };

//   return (
//     <motion.nav
//       className={
//         user &&
//         `mr-0.5 flex flex-col gap-16 border-r-gray-800 bg-slate-100 text-gray-500  py-8 dark:border-r-2 dark:bg-gray-900 dark:text-gray-400`
//       }
//       animate={{
//         width: isOpen ? 256 : 50,
//       }}
//       transition={{ duration: 0.3 }}
//       initial={false}
//     >
//       <div className="flex justify-between ">
//         <div>
//           {isOpen && (
//             <AnimatePresence>
//               <motion.span
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <p className="ml-3 mt-4 font-medium tracking-wide text-gray-500">
//                   Menu
//                 </p>
//               </motion.span>
//             </AnimatePresence>
//           )}
//         </div>
//         <div>
//           {!isOpen ? (
//             <motion.button
//               style={{ marginRight: 22 }}
//               title="Open menu"
//               whileHover={{ scale: 1.1 }}
//               whileFocus={{ scale: 1.1 }}
//               initial={false}
//               className="mt-10 ml-3 text-blue-600"
//               onClick={() => {
//                 setIsOpen(true);
//                 localStorage.setItem("isOpen", true);
//               }}
//             >
//               <PanelLeftOpen size={18} strokeWidth={2} />
//             </motion.button>
//           ) : (
//             <Button
//               title="Close menu"
//               icon={PanelLeftClose}
//               className="mt-1 text-violet-600"
//               onClick={() => {
//                 setIsOpen(false);

//                 localStorage.setItem("isOpen", false);
//               }}
//             ></Button>
//           )}
//         </div>
//       </div>
//       <nav className="flex gap-2 px-3">
//         <List className="flex flex-col gap-5">
//           {LINKS.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               className="flex gap-4 "
//               title={item.name}
//             >
//               {item.icon !== "Notify" ? (
//                 <item.icon size={18} strokeWidth={3} color={item.color} />
//               ) : (
//                 <item.icon
//                   color={item.color}
//                   className="fill-violet-600"
//                   size={18}
//                 />
//               )}

//               <AnimatePresence>
//                 {isOpen && (
//                   <motion.span
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.5 }}
//                     className="transition-all duration-300 hover:text-gray-400 dark:text-gray-300"
//                   >
//                     {item.name}
//                   </motion.span>
//                 )}
//               </AnimatePresence>
//             </NavLink>
//           ))}
//           <NavLink
//             className={
//               "mt-40 flex gap-4 hover:text-gray-400 dark:text-gray-300"
//             }
//             to="/login"
//             title="logout"
//             onClick={handleClick}
//           >
//             <LogOut size={18} strokeWidth={3} className="text-rose-600" />
//             <motion.div>
//               <AnimatePresence>
//                 {isOpen && (
//                   <motion.span
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={animate({ duration: 0.2 })}
//                     className="transition-all duration-300 hover:text-gray-300"
//                   >
//                     {isOpen && "Log out"}
//                   </motion.span>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           </NavLink>
//           <NavLink
//             to={user && user.role === "admin" ? "/admin/profile" : "/profile"}
//             className="flex gap-4"
//             end
//           >
//             {/* {user && token && <ProfileAvatar width={2} />} */}
//             {user && <Avatar />}
//             {isOpen && (
//               <p className="text-[1rem] font-medium tracking-wider">
//                 {(user && user.userName) || user.email.split("@")[0]}
//               </p>
//             )}
//           </NavLink>
//         </List>
//       </nav>
//     </motion.nav>
//   );
// };

// export default SideBar;
