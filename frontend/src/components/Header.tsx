import React from "react";

interface HeaderProps extends React.HTMLAttributes<HTMLHeadElement> {
  children?: React.ReactNode;
}
const Header = ({ children, ...props}: HeaderProps) => {
  return <header className={`bloxk ${props.className}`} {...props}>{children}</header>;
};

export default Header;
