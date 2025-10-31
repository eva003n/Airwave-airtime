import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import {
  MPESA_CUSTOMER_KEY,
  MPESA_CUSTOMER_SECRET,
  MPESA_BASE_URL,
  MPESA_AUTH_URL,
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
    this.customerKey = MPESA_CUSTOMER_KEY || "";
    this.customerSecret = MPESA_CUSTOMER_SECRET || "";
    this.audience = MPESA_BASE_URL || "";
    this.authUrl = MPESA_AUTH_URL || "";

    this.api = axios.create({
      baseURL: MPESA_BASE_URL || "",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 120000, // 2mins
    });
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
