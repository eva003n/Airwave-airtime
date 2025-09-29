import { useAuth } from "../context/authcontext";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { user } = useAuth();
  let isNew = false;
if(user) {
  const createdAt = new Date(user.createdAt);
  const today = new Date()
  isNew = createdAt.getDay() === today.getDay() && createdAt.getMonth() === today.getMonth() && createdAt.getFullYear() === today.getFullYear()

}




  if (user ) {
    return  <Navigate to="/" replace />
    
  } else {
    return <Outlet />;
  }
};

export default PublicRoute;
