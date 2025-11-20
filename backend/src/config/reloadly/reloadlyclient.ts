import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import {
  RELOADLY_CLIENT_ID,
  RELOADLY_CLIENT_SECRET,
  RELOADLY_AUDIENCE,
  RELOADLY_AUTH_URL,
  NODE_ENV,
  RELOADLY_SANDBOX_CLIENT_ID,
  RELOADLY_SANDBOX_CLIENT_SECRET,
  RELOADLY_SANDBOX_AUDIENCE,
  RELOADLY_SANDBOX_AUTH_URL,
} from "../env.js";
import logger from "../../logger/logger.winston.js";
import ApiError from "../../utils/ApiError.js";
import ThirdPartyServiceError from "../../utils/ServiceError.js";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

class ReloadlyClient {
  private clientId: string;
  private clientSecret: string;
  private audience: string;
  private authUrl: string;
  private token: string | null = null;
  private tokenExpiry: number = 0;
  private api: AxiosInstance;

  constructor() {
    this.clientId = NODE_ENV === "production"? RELOADLY_CLIENT_ID as string : RELOADLY_SANDBOX_CLIENT_ID as string;
    this.clientSecret = NODE_ENV === "production"? RELOADLY_CLIENT_SECRET as string : RELOADLY_SANDBOX_CLIENT_SECRET as string;
    this.audience = NODE_ENV === "production"? RELOADLY_AUDIENCE as string : RELOADLY_SANDBOX_AUDIENCE as string;
    this.authUrl = NODE_ENV === "production"?
      RELOADLY_AUTH_URL as string: RELOADLY_SANDBOX_AUTH_URL as string;

    this.api = axios.create({
      baseURL: this.audience, // Change if using other Reloadly APIs
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 120000, // 2mins
    });
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<{ message: string }>) => {

        const reloadlyError = new ThirdPartyServiceError(
          error.config?.url || "/topups",
          "Airtime api error",
          error.status || 500

        );
        if(error.status && error.status === 400) {
           return Promise.reject(
             ApiError.badRequest(
               error?.status || 500,
               error.config?.url || "/topups",
               error.response?.data.message ||
                 error.message ||
                 "Something went wrong",
               reloadlyError
             )
           );

        }else {
           return Promise.reject(
             ApiError.internalServerError(
               error?.status || 500,
               error.config?.url || "/topups",
               error.response?.data.message ||
                 error.message ||
                 "Something went wrong",
               reloadlyError
             )
           );
        }
        // return Promise.reject({
        //   ststus: error.status,
        //   message: error.response?.data.message || error.message || "Something went wrong",
        //   url: error.config?.url,
        //   method: error.config?.method
        // });
      }
    );
  }

  private async getAccessToken(): Promise<string> {
    //get current data in milliseconds and convert to seconds
    const now = Math.floor(Date.now() / 1000);
    if (this.token && now < this.tokenExpiry) {
      return this.token;
    }

    const res = await axios.post<TokenResponse>(this.authUrl, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      audience: this.audience,
      grant_type: "client_credentials",
    });

    this.token = res.data.access_token;
    this.tokenExpiry = now + res.data.expires_in - 60; // buffer
    return this.token;
  }

  public async request<T>(method: string, url: string, data?: any) {
    const token = await this.getAccessToken();
    return this.api.request<T>({
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }
}

export const reloadlyClient = new ReloadlyClient();
