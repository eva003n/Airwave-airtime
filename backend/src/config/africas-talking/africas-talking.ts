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
  AFRICAS_TALKING_API_KEY,
  AFRICAS_TALKING_USERNAME,
  AFRICAS_TALKING_AIRTIME_API_URI,
} from "../env.js";
import logger from "../../logger/logger.winston.js";
import ApiError from "../../utils/ApiError.js";
import ReloadlyError from "../../utils/ServiceError.js";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

class ApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL:
        AFRICAS_TALKING_AIRTIME_API_URI ||
        "https://api.sandbox.africastalking.com", // Change if using other africas talking APIs
      headers: {
        "Content-Type": "application/json",
        apikey: AFRICAS_TALKING_API_KEY,
        Accept: "application/json",
      },
      timeout: 120000, // 2mins
    });
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<{ message: string }>) => {
        const reloadlyError = new ReloadlyError(
          error.config?.url || "/topups",
          "Airtime api error",
          error.status || 500
        );
        if (error.status && error.status === 400) {
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
        } else {
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

  public async send<T, D>(url: string, data: T): Promise<AxiosResponse<D>> {
    return this.api.post<D>(url, data);
  }

  public async get<T>(url: string): Promise<T> {
    return this.api.get(url, {
      params: {
        username: AFRICAS_TALKING_USERNAME || "sandbox",
      },
    });
  }
}

export const africasTalkingClient = new ApiClient();
