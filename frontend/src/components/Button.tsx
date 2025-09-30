import type React from "react";

type IconProp = React.ComponentType<React.SVGProps<SVGSVGElement>>

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconProp | null 
  value: string,
  children?: React.ReactNode;
  isLoading?: boolean
}
const Button = ({ value, icon: Icon , isLoading = false, children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`w-full flex bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 items-center justify-center gap-2 py-1 rounded-sm   disabled:brightness-80 text-gray-200  ${props.className} cursor-pointer`}
      
    >
      {Icon && (
        <Icon
          className={`w-4 aspect-square sm:w-6    ${
            isLoading && "block animate-spin "
          }`}
        />
      )}
      {!isLoading && value}
      {children}
    </button>
  );
};
export default Button;
