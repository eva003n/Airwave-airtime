import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'


const AuthLayout = () => {
  return (
    <>
      {/* <Header className='bg-blue-900 flex py-1 justify-around'>
        <Logo/>
        <Navbar className=''>
          <ListContainer className='flex gap-14 items-center'>
            <List className='text-white'>
              <NavLink to={"/"}>Sign in</NavLink>
            </List>
            <List className='text-white py-1 px 1 ' >
              <NavLink to={"/sign-up"}>Sign up</NavLink>
            </List>
          </ListContainer>
        </Navbar>
      </Header> */}
      <main className='h-svh'>
        <section className="flex h-full items-center justify-center  ">
          <Outlet />
        </section>
      </main>
    </>
  );
}

export default AuthLayout
