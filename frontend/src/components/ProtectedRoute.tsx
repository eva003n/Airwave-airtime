import { Navigate, Outlet } from "react-router-dom";
import { getItem } from "../utils";
import type { IUser } from "@/interfaces/user.interface";

const ProtectedRoute = () => {
  // const  {user, token} = useAuth()
  const user = getItem<IUser>("user");

  if (!user) {
    return <Navigate to="/" replace />;
  } else {
    return <Outlet />;
  }
};

export default ProtectedRoute;
