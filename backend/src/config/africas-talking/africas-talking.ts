import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import {

  AFRICAS_TALKING_SANDBOX_API_KEY,
  AFRICAS_TALKING_SANDBOX_USERNAME,
  AFRICAS_TALKING_AIRTIME_API_SANDBOX_URI,
  NODE_ENV,
  AFRICAS_TALKING_AIRTIME_API,
  AFRICAS_TALKING_API_KEY,
  AFRICAS_TALKING_USERNAME,
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
  private audience: string;
  private apiKey : string;
  private userName: string;

  constructor() {
    this.audience = (NODE_ENV === "production"? AFRICAS_TALKING_AIRTIME_API : 
      AFRICAS_TALKING_AIRTIME_API_SANDBOX_URI) as string, // Change if using other africas talking APIs
    this.apiKey = (NODE_ENV === "production"?  AFRICAS_TALKING_API_KEY : AFRICAS_TALKING_SANDBOX_API_KEY) as string
    this.userName = (NODE_ENV === "production"? AFRICAS_TALKING_USERNAME :AFRICAS_TALKING_SANDBOX_USERNAME) as string

    this.api = axios.create({
      baseURL: this.audience,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        apikey: this.apiKey ,
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

  public async post<T, D>(url: string, data: T): Promise<AxiosResponse<D>> {
    return this.api.post<D>(url, data);
  }

  public async get<T>(url: string): Promise<T> {
    return this.api.get(url, {
      params: {
        username: this.userName,
      },
    });
  }
}

export const africasTalkingClient = new ApiClient();
