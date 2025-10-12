import { getItem } from "@/utils";
import { useAuth } from "../context/authcontext";
import { Navigate, Outlet } from "react-router-dom";
import type { IUser } from "@/interfaces/user.interface";

const PublicRoute = () => {
  const user = getItem<IUser>("user")
  let isNew = false;
if(user) {
  const createdAt = new Date(user.createdAt);
  const today = new Date()
  isNew = createdAt.getDay() === today.getDay() && createdAt.getMonth() === today.getMonth() && createdAt.getFullYear() === today.getFullYear()

}




  if (user ) {
    return  <Navigate to="/dashboard" replace />
    
  } else {
    return <Outlet />;
  }
};

export default PublicRoute;
