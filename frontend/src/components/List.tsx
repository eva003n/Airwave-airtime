import React from "react";

type IconProp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface ListProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  icon?: IconProp;
}
const List = ({
  children,
  icon: Icon,
  ...props
}: ListProps) => {
  return (
    <li className={` ${props.className}`}>
      {/* {Icon && <Icon className="w-6 h-6" />} */}
      {children}
    </li>
  );
};

export default List;
