import { Navigate, Outlet } from "react-router-dom";
import { getItem } from "../utils";

const ProtectedRoute = () => {
  // const  {user, token} = useAuth()
  const user = getItem("user");

  if (!user) {
    return <Navigate to="/log-in" replace />;
  } else {
    return <Outlet />;
  }
};

export default ProtectedRoute;
