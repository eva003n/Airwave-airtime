import { getItem } from "@/utils";
import type {
  ILogin,
  ISignUp,
  IVerifyEmail,
  IVerifyOtp,
} from "../interfaces/auth.interface";

import type {
  Analytics,
  AnalyticsAdmin,
  Id,
  OperatorDatail,
  OperatorDetect,
  PaginateData,
  ParsedRecipient,
  RecipientData,
  RecipientDataApi,
  RecipientForm,
  RecipientQueryData,
  Recipientupdate,
  SignInAuth,
  SignUpAuth,
  SingleTopUpForm,
  TopUpDataApi,
  UserData,
  UserDataApi,
  WalletData,
  WalletForm,
} from "../validation/validators";
import { apiClient } from "./apiclient";

//create and configure axios instance

//authentication endpoints
const signUpUser = async (data: SignUpAuth) => {
  return apiClient.request<{message: string}>("POST", "/auth/sign-up", data);
};
const logInUser = async (data: SignInAuth) => {
  return apiClient.request<UserDataApi>("POST", "/auth/sign-in", data);
};
const logOutUser = async (id: string) => {
  return apiClient.request<{message: string}>("DELETE", `/auth/sign-out/${id}`);
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
const getAllRecipients = async (params: RecipientQueryData) => {
  return apiClient.request<RecipientDataApi>("GET", `/recipients`, null, params);
};

//Top up management
const autoDetectOperator = async(data: OperatorDatail) => {
  return apiClient.request<OperatorDetect>("POST", "/top-ups/operators/autodetect", data)

}
const sendTopUp = async (data: SingleTopUpForm) => {
  return apiClient.request<{message: string}>("POST", "/top-ups", data)

}
const getAllTopUps = async(params: RecipientQueryData) => {
  return apiClient.request<TopUpDataApi>("GET", "/top-ups", null, params)

}

const deleteTopUp = async (id: string) => {
  return apiClient.request<{message: string}>("DELETE", `/top-ups/${id}`)

}

const createBulkTopUps = async (id: string, data: any, ) => {
  return apiClient.request<{message: string}>("POST", `/top-ups/bulk/${id}`, data, null, "multipart/form-data")

}

const startBulkTopUps = async () => {
  return apiClient.request<{message: string}>("GET", "/top-ups/bulk")

}

// wallet management
const getWalletBalance = async(id: string) => {
  return apiClient.request<WalletData>("GET", `/wallets/${id}`)
}
const updateWallet = async(data: WalletForm) => {
  return apiClient.request<{message: string}>("PUT", `/wallets`, data);

}

//Report management
const getAnalyticsData = async(id: string) => {
  return apiClient.request<Analytics>("GET", `/reports/${id}`)
}
/* ---- Admin ---- */
const getAdminAnalyticsData = async () => {
  return apiClient.request<AnalyticsAdmin>("GET", "/reports/admin");
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
/*Top ups */
  autoDetectOperator,
  sendTopUp,
  getAllTopUps,
  deleteTopUp,
  createBulkTopUps,
  startBulkTopUps,

  //Wallet management
  getWalletBalance,
  updateWallet,

  //report management
getAnalyticsData,
getAdminAnalyticsData
};
