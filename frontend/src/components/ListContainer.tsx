import React from "react";

interface ListUProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
}
const ListContainer = ({
  children,
  ...props

}: ListUProps) => {
  return <ul className={` ${props.className} `} >{children}</ul>;
};

export default ListContainer;
