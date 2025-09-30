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
import type { SignInAuth, SignUpAuth } from "../validation/validators";

const AuthContext = createContext<{
  user: null | IUser;
  setUser: Dispatch<SetStateAction<IUser | null>>;
  token: null | string;
  loading: boolean;
  signUp: (data: SignUpAuth) => Promise<any>;
  logOut: () => Promise<any>;
  logIn: (data: SignInAuth) => Promise<any>;
  verifyEmail: (data: IVerifyOtp) => Promise<any>;
  twoFactorAuth: (data: IVerifyOtp) => Promise<any>;
  refreshAuthToken: () => Promise<any>;
}>({
  user: null,
  setUser: async () => {},
  token: null,
  loading: false,
  signUp: async () => {},
  logOut: async () => {},
  logIn: async () => {},
  verifyEmail: async () => {},
  twoFactorAuth: async () => {},
  refreshAuthToken: async () => {},
});

const useAuth = () => useContext(AuthContext);

export { AuthContext, useAuth };
