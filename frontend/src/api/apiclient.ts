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
import { VITE_API_BASE_URI, VITE_SANDBOX_API_BASE_URL} from "@/config/env";

const env = getItem<"Live" | "Sandbox">("env") || "Live";
const user = getItem<UserData>("user");
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
    this.audience =
      env === "Live"
        ? VITE_API_BASE_URI
        : VITE_SANDBOX_API_BASE_URL;
    this.authUrl = "/auth/refresh-token";
    this.isRefreshing = false;

    this.api = axios.create({
      baseURL:
        env === "Live"
          ? VITE_API_BASE_URI
          : VITE_SANDBOX_API_BASE_URL, // fallback base url
      headers: {
        "Content-Type": "application/json",
        "x-env": `${env === "Live" ? "production" : "development"}`,
        "x-clientId": user?.id,
      },
      timeout: 120000, // 2mins
      withCredentials: true, //ensure that client sends cookies in reqyests and makes sure the client doesnt ignore cookies set by backend
    });
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const env = getItem<"Live" | "Sandbox">("env") || "Live"; // get ltest env variable
        (config.baseURL =
          env === "Live"
            ? VITE_API_BASE_URI
            : VITE_SANDBOX_API_BASE_URL), // call appropriate api based that env
          // set xustom header for the environment
          (config.headers["x-env"] =
            env === "Live" ? "production" : "development");
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
            
            await this.detectNetworkError(error)

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
              await logOutUser(user.id as string);
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

  private async detectNetworkError(error: AxiosError) {
    if (error.code === "Network Errpr")
      return alert("No internet connection. Please try again.");
  }

  public async getAccessToken(): Promise<string> {
    try {
      //get current data in milliseconds and convert to seconds
      const now = Math.floor(Date.now() / 1000);
      if (this.token && now < this.tokenExpiry) return this.token;

      //get latest environment
      const env = getItem<"Live" | "Sandbox">("env") || "Live";

      //use axios to avoid interceptor recursion
      const response = await axios.get<TokenResponse>(
        `${this.audience}${this.authUrl}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "x-env": env === "Live" ? "production" : "development",
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
