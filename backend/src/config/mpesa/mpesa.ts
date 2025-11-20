import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  MPESA_SANDBOX_CUSTOMER_KEY,
  MPESA_SANDBOX_CUSTOMER_SECRET,
  MPESA_SANDBOX_BASE_URL,
  MPESA_SANDBOX_AUTH_URL,
  MPESA_CUSTOMER_KEY,
  MPESA_BASE_URL,
  MPESA_AUTH_URL,
  NODE_ENV,
} from "../env.js";
import logger from "../../logger/logger.winston.js";
import ApiError from "../../utils/ApiError.js";
import ThirdPartyServiceError from "../../utils/ServiceError.js";

type TokenResponse = {
  access_token: string;
  expires_in: number; // 1 hour
};

class MpesaClient {
  private customerKey: string;
  private customerSecret: string;
  private audience: string;
  private authUrl: string;
  private token: string | null = null;
  private tokenExpiry: number = 0;
  private api: AxiosInstance;

  constructor() {
    this.customerKey = 
      NODE_ENV === "production"
        ? MPESA_CUSTOMER_KEY as string
        : MPESA_SANDBOX_CUSTOMER_KEY as string
    ;
    this.customerSecret = 
      NODE_ENV === "production"
        ? MPESA_SANDBOX_CUSTOMER_SECRET as string
        : MPESA_SANDBOX_CUSTOMER_SECRET as string
    ;
    this.audience = 
      NODE_ENV === "production" ? MPESA_BASE_URL as string : MPESA_SANDBOX_BASE_URL as string
  ;
    this.authUrl = 
      NODE_ENV === "production" ? MPESA_AUTH_URL as string : MPESA_SANDBOX_AUTH_URL as string
    ;

    this.api = axios.create({
      baseURL: this.audience,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 120000, // 2mins
    });

    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        logger.info(JSON.stringify(config.headers));
        return config;
      },
      (error: any) => Promise.reject(error)
    );
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<{ errorMessage: string }>) => {
        const mpesaError = new ThirdPartyServiceError(
          error.config?.url || "/api/v1/payments",
          error.response?.data.errorMessage || "Mpesa api error",
          error.status || 500
        );
        if (error.status && error.status === 400) {
          return Promise.reject(
            ApiError.badRequest(
              error?.status || 500,
              error.config?.url || "/api/v1/payments",
              error.response?.data.errorMessage ||
                error.message ||
                "Something went wrong",
              mpesaError
            )
          );
        } else {
          return Promise.reject(
            ApiError.internalServerError(
              error?.status || 500,
              error.config?.url || "/topups",
              error.response?.data.errorMessage ||
                error.message ||
                "Something went wrong",
              mpesaError
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
    const auth = Buffer.from(
      `${this.customerKey}:${this.customerSecret}`
    ).toString("base64");
    const res = await axios.get<TokenResponse>(this.authUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      params: {
        grant_type: "client_credentials",
      },
    });

    this.token = res.data.access_token;
    this.tokenExpiry = now + res.data.expires_in - 60; // refresh 1 minute before expiry
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
      },
    });
  }
}

export const mpesaClient = new MpesaClient();
