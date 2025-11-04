import { getItem, removeItem, showSessionExpiredAlert } from "@/utils";
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { logOutUser } from ".";
import type { IUser } from "@/interfaces/user.interface";
import type { TokenResponse, UserData } from "@/validation/validators";

const env = getItem<"Live" | "Sandbox">("env");
class ApiClient {
  private clientId: string;
  private clientSecret: string;
  private audience: string; //endpoint
  private authUrl: string;
  private token: string | null = null;
  private tokenExpiry: number = 0;
  private isRefreshing: boolean;
  private refreshQueue: (() => void)[] = [];

  private api: AxiosInstance;

  constructor() {
    this.clientId = "";
    this.clientSecret = "";
    this.audience = import.meta.env.VITE_API_BASE_URI;
    this.authUrl = "/auth/refresh-token";
    this.isRefreshing = false;

    this.api = axios.create({
      baseURL:
        env === "Live"
          ? import.meta.env.VITE_API_BASE_URI
          : import.meta.env.VITE_SANDBOX_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        "x-env": `${getItem<"Live" | "Sandbox">("env")}`,
      },
      timeout: 120000, // 2mins
      withCredentials: true, //ensure that client sends cookies in reqyests and makes sure the client doesnt ignore cookies set by backend
    });
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // set xustom header for the environment
        config.headers["x-env"] = getItem<"Live" | "Sandbox">("env");
        // Always attach the current access token
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError<{ message: string }>): Promise<Error> => {
        const failedRequest = error.config as AxiosRequestConfig & {
          _retry: boolean;
        };

        //handle 401 unauthorized

        if (error.response?.status == 401 && !failedRequest._retry) {
          failedRequest._retry = true;
          console.log(error.response.status);
          //If refresh already in progress, queue this request
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              return this.refreshQueue.push(() => {
                this.api
                  .request(failedRequest as AxiosRequestConfig)
                  .then((response: AxiosResponse) => resolve(response.data))
                  .catch((error: AxiosError) => reject(error));
              });
            });
          }
          this.isRefreshing = true;

          try {
            //force token refresh
            const newToken = await this.getAccessToken();

            // retry all queued requests
            this.refreshQueue.forEach((cb: any) => cb());
            this.refreshQueue = [];

            // Retry the origin failed request
            failedRequest.headers = {
              ...failedRequest.headers,
              Authorization: `Bearer ${newToken}`,
            };

            return this.api(failedRequest); // retry once
          } catch (error) {
            const confirmed = await showSessionExpiredAlert();
            const user = getItem<UserData>("user");
            if (confirmed) {
              await logOutUser(user.id);
              this.clearAuthAndLogout();
            }
            // else {
            //   await logOutUser(user.id);
            //   this.clearAuthAndLogout();
            // }
          } finally {
            this.isRefreshing = false;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public async getAccessToken(): Promise<string> {
    try {
      //get current data in milliseconds and convert to seconds
      const now = Math.floor(Date.now() / 1000);
      if (this.token && now < this.tokenExpiry) return this.token;

      //use axios to avoid interceptor recursion
      const response = await axios.get<TokenResponse>(
        `${this.audience}${this.authUrl}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "x-env": `${getItem<"Live" | "Sandbox">("env")}`,
          },
        }
      );

      //  const {access_token, expires_in} = response.data.data

      this.token = response.data.data.access_token;
      this.tokenExpiry = response.data.data.expires_in - 60; // -60 as a safety buffer to refresh the token 1 minute before to avoid unauthorized errors mid-request
      return response.data.data.access_token;
    } catch (error) {
      // console.log(error)
      throw error;
    }
  }

  private clearAuthAndLogout() {
    // Clear localStorage, and redirect
    removeItem("user");
    this.token = null;
    this.tokenExpiry = 0;
    window.location.href = "/";
  }

  public async request<T>(
    method: string,
    url: string,
    data?: any,
    params?: any,
    contentType?: string
  ) {
    // const token = await this.getAccessToken();
    return this.api.request<T>({
      method,
      url,
      data,
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": contentType || "application/json",
      },
      params,
    });
  }
}

export const apiClient = new ApiClient();
