import { getItem, removeItem, showSessionExpiredAlert } from "@/utils";
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { boolean, string } from "zod";
import { logOutUser } from ".";
import type { IUser } from "@/interfaces/user.interface";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

class ApiClient {
  private clientId: string;
  private clientSecret: string;
  private audience: string; //endpoint
  private authUrl: string;
  private token: string | null = null;
  private tokenExpiry: number = 0;
  private isRefreshing = false;
  private refreshQueue: (() => void)[] = [];

  private api: AxiosInstance;

  constructor() {
    this.clientId = "";
    this.clientSecret = "";
    this.audience = import.meta.env.VITE_API_BASE_URI;
    this.authUrl = import.meta.env.VITE_API_AUTH_URL;

    this.api = axios.create({
      baseURL:
        import.meta.env.VITE_API_BASE_URI || "http://localhost:8000/api/v1",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 120000, // 2mins
      withCredentials: true, //ensure that client sends cookies in reqyests and makes sure the client doesnt ignore cookies set by backend
    });
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        //   const token = await this.getAccessToken()
        // config.headers.Authorization= `Bearer ${token}`

        return config;
      },
      (error) => Promise.reject(error)
    );
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError<{ message: string }>): Promise<Error> => {
        const failedRequest = error.config as AxiosRequestConfig & {
          _retry: boolean;
        };

        if (error.response?.status == 401 && !failedRequest._retry) {
          failedRequest._retry = true;
          // 🪄 If refresh already in progress, queue this request
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.refreshQueue.push(() => {
                this.api(failedRequest as AxiosRequestConfig)
                this.api
                  .request(failedRequest as AxiosRequestConfig)
                  .then((response: AxiosResponse) => resolve(response))
                  .catch((error: AxiosError) => reject(error));
              });
            });
          }
          this.isRefreshing = true;

          try {
            //force token refresh
            const newToken = await this.getAccessToken();

            // retry all queued requests
            this.refreshQueue.forEach((cb) => cb());
            this.refreshQueue = [];

            failedRequest.headers = {
              ...failedRequest.headers,
              Authorization: `Bearer ${newToken}`,
            };

            return this.api(failedRequest); // retry once
          } catch (error) {
            const confirmed = await showSessionExpiredAlert();
              const user = getItem<IUser>("user");

            if (confirmed) {

              await logOutUser(user.id);
              this.clearAuthAndLogout();
            } else {

              await logOutUser(user.id);
              this.clearAuthAndLogout();
            }
          } finally {
            this.isRefreshing = false;
          }
        }
         return Promise.reject(error);

      }
    );
  }

  private async getAccessToken(): Promise<string> {
    //get current data in milliseconds and convert to seconds
    const now = Math.floor(Date.now() / 1000);
    if (this.token && now < this.tokenExpiry) {
      return this.token;
    }

    const res = await axios.get<TokenResponse>(this.authUrl);

    this.token = res.data.access_token;
    this.tokenExpiry = now + res.data.expires_in - 60; // -60 as a safety buffer to refresh the token 1 minute before to avoid unauthorized errors mid-request
    return this.token;
  }

  private async refreshAccessToken(): Promise<string> {
    try {
      const response = await axios.get<{ access_token: string }>(
        `${import.meta.env.VITE_API_AUTH_URL}`,
        { withCredentials: true }
      );
      const token = response.data.access_token;
      this.api.defaults.headers.Authorization = `Bearer ${token}`;
      return token;
    } catch (err) {
      throw new Error("Token refresh failed");
    }
  }

  private clearAuthAndLogout() {
    // Clear cookies, localStorage, and redirect
    removeItem("user");
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
      withCredentials: true,
      params,
    });
  }
}

export const apiClient = new ApiClient();
