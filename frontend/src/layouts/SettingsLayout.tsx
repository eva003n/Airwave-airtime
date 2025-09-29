import React from 'react'
import ListContainer from '../components/ListContainer'
import List from '../components/List'
import { NavLink } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { Bell, CircleUserRound, ShieldCheck, User, Wrench } from 'lucide-react'
import Tab from '../components/Tab'
const SettingsLayout = () => {
  return (
    <section className="grid md:grid-cols-[16rem_1fr] gap-4  text-gray-200 pb-30  ">
      <nav className="border-zinc-800 border-r-[1.2px] px-4 md:h-screen overflow-y-auto">
        <p className="text-2xl font-bold mb-5">Settings</p>
        <div className="rounded-md bg-zinc-800 p-4 text-gray-400 ">
          <p className="text-xl font-bold flex gap-2 tracking-wide text-gray-300">
            <Wrench size={24} className="text-amber-600 " />
            Accounts center
          </p>
          <p className=" text-[.9rem] mt-3">Manage your account settings</p>
          <div className="text-[.7rem] mt-3 grid gap-4">
            <p className="flex gap-2 items-center">
              <User size={16} />
              Personal details
            </p>
            <p className="flex gap-2 items-center">
              <ShieldCheck size={16} />
              Passwords and security
            </p>
          </div>
        </div>
        <ListContainer className="mt-5 flex md:flex-col  justify-around sm:justify-evenly  items-center sm:items-start">
          <p className="text-gray-500 text-[.9rem] hidden md:flex">
            How you use Flavafam
          </p>
          {/* <List>
            <CircleUserRound size={24} className="hidden sm:flex" />
            <NavLink to={"/accounts/edit"} end>
              Edit profile
            </NavLink>
          </List> */}
          <Tab
            value="Edit profile"
            icon={CircleUserRound}
            link="/accounts/edit"
          />
          <Tab
            value="Notifications"
            icon={Bell}
            link="/accounts/notifications"
          />
          <Tab value="Security" icon={ShieldCheck} link="/accounts/security" />

          {/* <List>
            <ShieldCheck size={24} className="hidden sm:flex" />
            <NavLink to={"/accounts/notifications"} end>
              Security
            </NavLink>
          </List> */}
        </ListContainer>
      </nav>
      <div className="h-screen overflow-y-auto scrollbar-custom">
        {<Outlet />}
      </div>
    </section>
  );
}

export default SettingsLayout