import { getItem } from "@/utils";
import { useAuth } from "../context/authcontext";
import { Navigate, Outlet } from "react-router-dom";
import type { IUser } from "@/interfaces/user.interface";
import type { UserData } from "@/validation/validators";

const PublicRoute = () => {
  const user = getItem<UserData>("user")
  let isNew = false;
if(user) {
  const createdAt = new Date(user?.createdAt as string);
  const today = new Date()
  isNew = createdAt.getDay() === today.getDay() && createdAt.getMonth() === today.getMonth() && createdAt.getFullYear() === today.getFullYear()

}




  if (user && user.role === "user" ) {
    console.log("user logged in")
    return  <Navigate to="/dashboard" replace={true} />
    
  } 
  else if(user && user.role === "admin") {
      console.log("Admin logged in");


    return <Navigate to="/admin/dashboard" replace={true} />;


  }
  else {
    return <Outlet />;
  }
};

export default PublicRoute;
