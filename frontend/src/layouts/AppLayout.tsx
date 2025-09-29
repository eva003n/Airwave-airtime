import Header from "../components/Header";
import ListContainer from "../components/ListContainer";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";
import List from "../components/List";
import { NavLink, Outlet } from "react-router-dom";
import Avatar from "../components/Avatar";
import ToggleSwitch from "../components/ToggleSwitch";


const  AppLayout = () => {
  return (
    <>
      <Header className="bg-violet-950 flex py-1 justify-around items-center px-8">
        <Logo />
        <Navbar className="grow">
          <ListContainer className="flex gap-7 items-center justify-center">
            <List className="text-gray-100  bg-color px-2 py-2 rounded-2xl">
              <NavLink to={"/"}>Dashboard</NavLink>
            </List>
            <List className="text-white py-1 px 1 ">
              <NavLink to={"/recipients"}>Recipients</NavLink>
            </List>
            <List className="text-white py-1 px 1 ">
              <NavLink to={"/top-ups"}>Top ups</NavLink>
            </List>
            <List className="text-white py-1 px 1 ">
              <NavLink to={"/wallet"}>Wallet</NavLink>
            </List>
            <List className="text-white py-1 px 1 ">
              <NavLink to={"/transactions"}>Transactions</NavLink>
            </List>
          </ListContainer>
        </Navbar>
        <div className="flex items-center gap-8">
          {/* <ToggleSwitch/> */}
          <Avatar width={40}/>
        </div>
      </Header>
      <main>{<Outlet />}</main>
    </>
  );
}

export default AppLayout