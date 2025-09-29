import type React from "react";
import { useState } from "react";
import List from "./List";
import { NavLink } from "react-router-dom";

type IconProp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const Tab = ({ icon: Icon, value, link }: { icon?: IconProp; value: string, link: string }) => {
  const [isActive, setIsActive] = useState(true)
  return (
    <List className="flex flex-col gap-3 cursor-pointer hover:bg-zinc-950 tab" title={value}>
      {/* {isActive && <span className="h-[.5px] bg-gray-300 w-full"></span>} */}
      <NavLink to={link} className="flex gap-2 items-center" end>
        {Icon && <Icon className="w-6 h-6 " />}
        <span className="hidden sm:flex">{value}</span>
      </NavLink>
    </List>
  );
};

export default Tab;
