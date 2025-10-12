import type {
  ILogin,
  ISignUp,
  IVerifyEmail,
  IVerifyOtp,
} from "../interfaces/auth.interface";

import type {
  Id,
  PaginateData,
  RecipientData,
  RecipientDataApi,
  RecipientForm,
  Recipientupdate,
  SignInAuth,
  SignUpAuth,
} from "../validation/validators";
import { apiClient } from "./apiclient";

//create and configure axios instance

//authentication endpoints
const signUpUser = async (data: SignUpAuth) => {
  return apiClient.request("POST", "/auth/sign-up", data);
};
const logInUser = async (data: SignInAuth) => {
  return apiClient.request("POST", "/auth/sign-in", data);
};
const logOutUser = async (id: string) => {
  return apiClient.request("DELETE", `/auth/sign-out/${id}`);
};

const refreshToken = async () => {
  return apiClient.request("GET", "/auth/refresh-token");
};
  type Data = {
    message: string;
  };
//recipient managements endpoints
const createRecipient = async (data: RecipientForm) => {
 
  return apiClient.request<Data>("POST", "/recipients", data);
};


const updateRecipient = async (data: RecipientForm, id: string) => {
  return apiClient.request<Data>("PUT", `/recipients/${id}`, data);
};
const deleteRecipient = async (id: Id) => {
  return apiClient.request<Data>("DELETE", `/recipients/${id}`);
};
const getRecipient = async (id: Id) => {
  return apiClient.request<Recipientupdate>("GET", `/recipients/${id}`)
};
const getAllRecipients = async (params: PaginateData) => {
  return apiClient.request<RecipientDataApi>("GET", `/recipients`, null, params);
};

export {
  signUpUser,
  logInUser,
  logOutUser,
  refreshToken,
  createRecipient,
  updateRecipient,
  deleteRecipient,
  getRecipient,
  getAllRecipients,
};
