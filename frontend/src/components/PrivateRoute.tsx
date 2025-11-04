import { getItem } from '@/utils';
import type { UserData } from '@/validation/validators';
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const user = getItem<UserData>("user");

  if(user && user.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }else {
    return <Outlet/>
  }

}

export default PrivateRoute