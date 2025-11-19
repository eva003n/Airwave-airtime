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
} from "../env.js";
import logger from "../../logger/logger.winston.js";
import ApiError from "../../utils/ApiError.js";
import ThirdPartyServiceError from "../../utils/ServiceError.js";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

class CredoFasterClient {
  private clientId: string;
  private clientSecret: string;
  private audience: string;
  private authUrl: string;
  private token: string | null = null;
  private tokenExpiry: number = 0;
  private api: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.clientId = RELOADLY_CLIENT_ID || "";
    this.clientSecret = RELOADLY_CLIENT_SECRET || "";
    this.audience = RELOADLY_AUDIENCE || "https://topups-sandbox.reloadly.com";
    this.authUrl =
      RELOADLY_AUTH_URL || "https://auth.reloadly.com/oauth/token ";

    this.api = axios.create({
      baseURL: RELOADLY_AUDIENCE || "https://topups-sandbox.reloadly.com", // Change if using other Reloadly APIs
      headers: {
        "Content-Type": "application/json",
        ApiKey: 
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

export const credoFasterClient = new CredoFasterClient();
