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
    this.authUrl = import.meta.env.VITE_API_AUTH_URL;
    this.isRefreshing = false;

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
          console.log(error.response.status)
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
            //force token refresh]
            const newToken = await this.getAccessToken();
console.log(newToken)
            // retry all queued requests
            this.refreshQueue.forEach((cb: any) => cb());
            this.refreshQueue = [];

            failedRequest.headers = {
              ...failedRequest.headers,
              Authorization: `Bearer ${newToken}`,
            };

            return this.api(failedRequest); // retry once
          } catch (error) {
            console.log("wirking");

            const confirmed = await showSessionExpiredAlert();
            const user = getItem<UserData>("user");
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
   try {
     //get current data in milliseconds and convert to seconds
     const now = Math.floor(Date.now() / 1000);
     if (this.token && now < this.tokenExpiry) {
       return this.token;
     }

     const res = await this.api.get<TokenResponse>(this.authUrl);

     this.token = res.data.data.access_token;
     this.tokenExpiry = now + res.data.data.expires_in - 60; // -60 as a safety buffer to refresh the token 1 minute before to avoid unauthorized errors mid-request
     console.log(this.token);
     console.log(this.tokenExpiry);
     return this.token;
   } catch (error) {
    throw new Error("Failed to refresh token")
    
   }
  }

  private clearAuthAndLogout() {
    // Clear localStorage, and redirect
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
      params,
    });
  }
}

export const apiClient = new ApiClient();
