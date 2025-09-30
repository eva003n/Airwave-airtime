import ListContainer from "./ListContainer";
import List from "./List";
import { Bookmark, LogOut, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import Button from "./Button";

const Menu = () => {
    const {logOut} = useAuth()

    const handleLogOut = async() => {
        await logOut()
    }
  return (
    <nav className="absolute bg-zinc-800 text-gray-400 -top-[12rem] w-[16rem] rounded-md p-4">
      <ListContainer>
        <List>
          <Settings size={24} />
          <NavLink to={"/accounts/edit"} end>
            Settings
          </NavLink>
        </List>
        <List>
          <Bookmark size={24} />
          <NavLink to={"/profile/saved"} end>
            Saved
          </NavLink>
        </List>
        <List className="p-0">
          <Button value="Log out" onClick={handleLogOut} className="w-max text-gray-400 gap-4 justidy-start" icon={LogOut} />
        </List>
      </ListContainer>
    </nav>
  );
};

export default Menu;
