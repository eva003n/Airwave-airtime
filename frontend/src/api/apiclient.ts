import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";

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
    });
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<{ message: string }>): Promise<Error> => {
        return Promise.reject({
          ststus: error.status,
          message:
            error.response?.data.message ||
            error.message ||
            "Something went wrong",
          url: error.config?.url,
          method: error.config?.method,
        });
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
    this.tokenExpiry = now + res.data.expires_in - 60; // buffer
    return this.token;
  }

  public async request<T>(
    method: string,
    url: string,
    data?: any,
    params?: any
  ) {
    // const token = await this.getAccessToken();
    return this.api.request<T>({
      method,
      url,
      data,
      headers: {
        // Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params,
    });
  }
}

export const apiClient = new ApiClient();
