import React from "react";
 interface DivProps extends React.EmbedHTMLAttributes<HTMLDivElement> {
   children: React.ReactNode;
 }

const TopBar: React.FC<DivProps> = ({ children, ...props }) => {
  return <div className={`fixed top-0 right-0 left-0 flex py-2 px-4 text-gray-200 bg-zinc-900  gap-4 justify-around items-center md:hidden ${props.className} `}>{children}</div>;
};

export default TopBar;
