import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import type {
  ILogin,
  ISignUp,
  IVerifyEmail,
  IVerifyOtp,
} from "../interfaces/auth.interface";
import { getItem, removeItem, setItem } from "../utils";
import { toast } from "react-toastify";
import type { SignInAuth, SignUpAuth } from "../validation/validators";
import { boolean } from "zod";
//create and configure axios instance

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URI || "http://localhost:8000/api/v1",
  headers: {
    Content_Type: "application/json",
  },
  timeout: 120000,
  withCredentials: true,
  adapter: "fetch",
});

//interceptors
// apiClient.interceptors.request.use((config) => {
//   config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
//   return config;
// });

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {

    return response.data;
  },
  (error: AxiosError) => {
    type request = {
      _retry: boolean 
    }
    // const failedRequest: InternalAxiosRequestConfig<{_retry: boolean}> = error.config;

    // failedRequest._retry = false;

    
    // console.log(error.response?.data.message);

    if (error.response?.status === 401) {
      refreshToken()
        .then(() => {
          // if (failedRequest && !failedRequest._retry) {
          //   failedRequest._retry = true;
          //   apiClient(failedRequest);
          // }
          // setItem("token", response.data.accessToken);
        })
        .catch(() => {
          logOutUser().then(() => {
            removeItem("token");
            return window.location.reload();
          });
        });

      // toast.success(response.message);
    }
    // return Promise.reject(error);
    return Promise.reject(error.response?.data || error);
  }
);
//authentication endpoints
const signUpUser = async (data: SignUpAuth) => {
  return apiClient.post("/auth/sign-up", data);
};
const logInUser = async (data: SignInAuth) => {
  return apiClient.post("/auth/sign-in", data);
};
const logOutUser = async () => {
  return apiClient.delete("/auth/sign-out");
};

const refreshToken = async () => {
  return apiClient.post("/auth/refresh-token");
};

const verify_email = async (data: IVerifyEmail) => {
  return apiClient.post("/auth/verify-email", data);
};
const multiFactorAuthentication = async (data: IVerifyOtp) => {
  return apiClient.post("/auth/verify-TFA", data);
};

//user managements endpoints

export {
  signUpUser,
  logInUser,
  logOutUser,
  verify_email,
  multiFactorAuthentication,
  refreshToken,
 
};
