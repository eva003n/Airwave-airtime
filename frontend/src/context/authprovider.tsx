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
import type { SignInAuth, SignUpAuth, UserData, UserDataApi } from "../validation/validators";
import LoaderPage from "../components/LoaderComponent";
import { toast } from "react-toastify";


const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<null | UserData>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signUp = async (data: SignUpAuth) => {
    console.log(data)
    setLoading(true);
    return requestHandler(
       () =>  signUpUser(data),
      
      (res: AxiosResponse<{message: string}>) => {
        // setItem("user", JSON.stringify(res.data));
        setLoading(false);
        navigate("/");
        toast.success(res.data.message)
        return res;
      },
      (err: Error) => {
        setLoading(false);
        console.error(err.message)
        return err;
      }
    );
  };


  const logIn = async (data: SignInAuth) => {
    setLoading(true);
    return requestHandler(
       () => logInUser(data),
      (
        response: AxiosResponse<UserDataApi>

      ) => {
        setUser(response.data.data.user)
        setItem("user", JSON.stringify(response.data.data.user))
        setLoading(false);
        navigate("/dashboard")
        toast.success(response.data.message)
  



        return response;
      },
      (err: Error) => {
        setLoading(false);
        console.error(err.message)
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
      async () => {
        const user = getItem<UserData>("user");
        await logOutUser(user.id);
      },
      (response: AxiosResponse<{ message: string  }>) => {
        setLoading(false);
        setUser(null);
        removeItem("user");
        navigate("/");
        console.log(response)
        toast.success(response.data.message);
        return response;
      },
      (err: Error) => {
        setLoading(false);
        console.error(err.message);
        return err;
      }
    );
  };

  useEffect(() => {
    const _user = getItem<UserData>("user");
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
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
