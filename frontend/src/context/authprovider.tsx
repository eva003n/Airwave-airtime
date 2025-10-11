import { useEffect, useState } from "react";
import { AuthContext } from "./authcontext";
import type {
  ISignUp,
  ILogin,
  IVerifyOtp,
  IVerifyEmail,
} from "../interfaces/auth.interface";

import {
  logInUser,
  logOutUser,

  refreshToken,
  signUpUser,
} from "../api";
import { useNavigate } from "react-router-dom";
import type { AxiosResponse } from "axios";
import type { IUser } from "../interfaces/user.interface";
import { setItem, removeItem, getItem } from "../utils";
import requestHandler from "../utils/requestHandler";
import type { SignInAuth, SignUpAuth } from "../validation/validators";
import LoaderPage from "../components/LoaderComponent";
import { toast } from "react-toastify";


const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<null | IUser>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signUp = async (data: SignUpAuth) => {
    console.log(data)
    setLoading(true);
    return requestHandler(
       () =>  signUpUser(data),
      
      (res: AxiosResponse) => {
        // setItem("user", JSON.stringify(res.data));
        setLoading(false);
        navigate("/");
        return res;
      },
      (err: Error) => {
        setLoading(false);
        return err;
      }
    );
  };


  const logIn = async (data: SignInAuth) => {
    setLoading(true);
    return requestHandler(
       () => logInUser(data),
      (
        response: AxiosResponse<IUser>

      ) => {
        setUser(response.data)
        setItem("user", JSON.stringify(response.data))
        setLoading(false);
        // toast.success(response.message)



        return response;
      },
      (err: Error) => {
        setLoading(false);
        toast.error(err.message)
        return err;
      }
    );
  };


  const refreshAuthToken = async () => {
    return requestHandler(
      async () => await refreshToken(),
      (response: AxiosResponse) => {
        setItem("token", response.data.accessToken);
        return response;
      },
      (error: Error) => {
        console.error(error.message);
        return error;
      }
    );
  };
  const logOut = async () => {
    setLoading(true);
    return requestHandler(
      async () => await logOutUser(),
      (response: AxiosResponse<{ message: string }>) => {
        setLoading(false);
        setUser(null);
        removeItem("user")
        navigate("/log-in");
        toast.success(response.data.message)
        return response;
      },
      (err: Error) => {
        setLoading(false);
        toast.error(err.message);
        return err;
      }
    );
  };

  useEffect(() => {
    const _user = getItem("user");
    if (_user) {
      setUser(_user);
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        signUp,
        logOut,
        logIn,
        refreshAuthToken,
      }}
    >
      {loading? <LoaderPage/> : <div>{children}</div>}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
