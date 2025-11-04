import { useEffect, useState } from "react";
import { AuthContext } from "./authcontext";
import type {
  ISignUp,
  ILogin,
  IVerifyOtp,
  IVerifyEmail,
} from "../interfaces/auth.interface";

import { logInUser, logOutUser, refreshToken, signUpUser } from "../api";
import { useNavigate } from "react-router-dom";
import type { AxiosError, AxiosResponse } from "axios";
import type { IUser } from "../interfaces/user.interface";
import { setItem, removeItem, getItem } from "../utils";
import requestHandler from "../utils/requestHandler";
import type {
  SignInAuth,
  SignUpAuth,
  UserData,
  UserDataApi,
} from "../validation/validators";
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
    setLoading(true);
    return requestHandler(
      () => signUpUser(data),

      (res: AxiosResponse<{ message: string }>) => {
        // setItem("user", JSON.stringify(res.data));
        setLoading(false);
        navigate("/");
        toast.success(res.data.message);
        return res;
      },
      (err: AxiosError<{ message: string }>) => {
        setLoading(false);
        toast.error(err.response?.data.message || err.message);
        return err;
      }
    );
  };

  const logIn = async (data: SignInAuth) => {
    setLoading(true);
    return requestHandler(
      () => logInUser(data),
      (response: AxiosResponse<UserDataApi>) => {
        const user = getItem<UserData>("user");

        setUser(response.data.data.user);
        setItem("user", JSON.stringify(response.data.data.user));
        setLoading(false);

        user && user.role === "user"
          ? navigate("/dashboard", { replace: true })
          : navigate("/admin/dashboard", { replace: true });

        toast.success(response.data.message);
        return response;
      },
      (err: AxiosError<{ message: string }>) => {
        setLoading(false);
        toast.error(err.response?.data.message || err.message);
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
      (err: AxiosError<{ message: string }>) => {
        setLoading(false);
        console.error(err.response?.data.message);
        return err;
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
      (response: AxiosResponse<{ message: string }>) => {
        try {
          setLoading(false);
          setUser(null);
          removeItem("user");
          toast.success("Sign out successfully");
          navigate("/", { replace: true });
        } catch (error) {
          console.log(error);
        }

        return response;
      },
      (err: AxiosError<{ message: string }>) => {
        setLoading(false);
        toast.error(err.response?.data.message);
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
