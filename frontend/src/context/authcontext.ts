import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type {
  ILogin,
  ISignUp,
  IVerifyOtp,
} from "../interfaces/auth.interface";
import type { IUser } from "../interfaces/user.interface";
import type { SignInAuth, SignUpAuth, UserData, UserDataApi } from "../validation/validators";

const AuthContext = createContext<{
  user: null | UserData;
  setUser: Dispatch<SetStateAction<UserData | null>>;
  token: null | string;
  loading: boolean;
  signUp: (data: SignUpAuth) => Promise<any>;
  logOut: () => Promise<any>;
  logIn: (data: SignInAuth) => Promise<any>;
  refreshAuthToken: () => Promise<any>;
}>({
  user: null,
  setUser: async () => {},
  token: null,
  loading: false,
  signUp: async () => {},
  logOut: async () => {},
  logIn: async () => {},
  refreshAuthToken: async () => {},
});

const useAuth = () => useContext(AuthContext);

export { AuthContext, useAuth };
