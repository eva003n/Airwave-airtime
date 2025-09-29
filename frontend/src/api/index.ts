import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import type {
  ILogin,
  ISignUp,
  IVerifyEmail,
  IVerifyOtp,
} from "../interfaces/auth.interface";
import { getItem, removeItem, setItem } from "../utils";
import { toast } from "react-toastify";
import type { SignInAuth, SignUpAuth } from "@/validation/validators";
//create and configure axios instance

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URI,
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
    const failedRequest = error.config;
    failedRequest._retry = false;
    console.log(error.response?.data.message);

    if (error.response?.status === 401) {
      refreshToken()
        .then((response) => {
          if (failedRequest && !failedRequest._retry) {
            failedRequest._retry = true;
            apiClient(failedRequest);
          }
          // setItem("token", response.data.accessToken);
        })
        .catch((err) => {
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
const createUserProfile = async (data) => {
  return apiClient.post("/users", data);
};
const getUserProfile = async (data) => {
  return apiClient.get("/users/profile", data);
};
const updateUserProfile = async (data: any) => {
  return apiClient.put("/users/profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

//recipe managements endpoints
const createRecipe = async (data, page: number, limit: number) => {
  return apiClient.post("/recipes", data, {
    params: {
      page: page || 1,
      limit: limit || 10,
    },
  });
};
const getSpecificRecipe = async (recipeId: string) => {
  return apiClient.get(`/recipes/${recipeId}`);
};
const searchForRecipe = async () => {
  return apiClient.get("/recipes/search");
};

//interaction features enpoints
const rateRecipe = async (data, recipeId: string) => {
  return apiClient.post(`/recipes/${recipeId}/rate`, data);
};
const commentOnRecipe = async (data, recipeId: string) => {
  return apiClient.post(`/recipes/${recipeId}/comments`, data);
};

const saveFavoriteRecipe = async (data, recipeId: string) => {
  return apiClient.post(`/recipes/${recipeId}/save`, data);
};
const followUser = async (data, user_id: string) => {
  return apiClient.post(`/users/${user_id}/follow`, data);
};
//social features endpoints
const shareRecipe = async (recipeId: string) => {
  return apiClient.get(`/recipes/${recipeId}/share`);
};
const getRecipePublishedByUser = async (user_id: string) => {
  return apiClient.get(`/users/${user_id}/recipes`);
};

const getNotifications = async () => {
  return apiClient.get("/notifications");
};
export {
  signUpUser,
  logInUser,
  logOutUser,
  verify_email,
  multiFactorAuthentication,
  refreshToken,
  getUserProfile,
  updateUserProfile,
  createRecipe,
  getSpecificRecipe,
  searchForRecipe,
  rateRecipe,
  commentOnRecipe,
  saveFavoriteRecipe,
  shareRecipe,
  createUserProfile,
  followUser,
  getRecipePublishedByUser,
  getNotifications,
};
