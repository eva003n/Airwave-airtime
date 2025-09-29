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
  multiFactorAuthentication,
  refreshToken,
  signUpUser,
  verify_email,
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

  const verifyEmail = async (data: IVerifyEmail) => {
    console.log(data);

    setLoading(true);
    return requestHandler(
      async () => await verify_email(data),
      (response: AxiosResponse) => {
        if (response.data.isEmailVerified) {
          navigate("/log-in");
          setLoading(false);
        }
        return response;
      },
      (error: Error) => {
        setLoading(false);

        return error;
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
        toast.success(response.message)



        return response;
      },
      (err: Error) => {
        setLoading(false);
        toast.error(err.message)
        return err;
      }
    );
  };
  const twoFactorAuth = async (data: IVerifyOtp) => {
    setLoading(true);
    return requestHandler(
      async () => await multiFactorAuthentication(data),
      (response: AxiosResponse) => {
        setToken(response.data.accessToken);
        setUser(response.data.user);

        setItem("token", response.data.accessToken);
        setItem("user", JSON.stringify(response.data.user));
        setLoading(false);
        navigate("/dashboard");
        return response;
      },
      (error: Error) => {
        setLoading(false);
        return error;
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
        verifyEmail,
        twoFactorAuth,
        refreshAuthToken,
      }}
    >
      {loading? <LoaderPage/> : <div>{children}</div>}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
