import  React from 'react'

interface NavProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}
const Navbar = ({children, ...props} : NavProps) => {
  return (
    <nav className={`${props.className}`} {...props}>
      {children}
        
    </nav>
  )
}

export default Navbar