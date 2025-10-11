import axios, { AxiosError } from "axios";
import { RELOADLY_CLIENT_ID, RELOADLY_CLIENT_SECRET, RELOADLY_AUDIENCE, RELOADLY_AUTH_URL } from "../env.js";
import logger from "../../logger/logger.winston.js";
class ReloadlyClient {
    clientId;
    clientSecret;
    audience;
    authUrl;
    token = null;
    tokenExpiry = 0;
    api;
    constructor() {
        this.clientId = RELOADLY_CLIENT_ID || "";
        this.clientSecret = RELOADLY_CLIENT_SECRET || "";
        this.audience = RELOADLY_AUDIENCE || "https://topups-sandbox.reloadly.com";
        this.authUrl = RELOADLY_AUTH_URL || "https://auth.reloadly.com/oauth/token ";
        this.api = axios.create({
            baseURL: RELOADLY_AUDIENCE || "https://topups-sandbox.reloadly.com", // Change if using other Reloadly APIs
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 120000 // 2mins
        });
        this.api.interceptors.response.use((response) => response, (error) => {
            return Promise.reject({
                ststus: error.status,
                message: error.response?.data.message || error.message || "Something went wrong",
                url: error.config?.url,
                method: error.config?.method
            });
        });
    }
    async getAccessToken() {
        //get current data in milliseconds and convert to seconds
        const now = Math.floor(Date.now() / 1000);
        if (this.token && now < this.tokenExpiry) {
            return this.token;
        }
        const res = await axios.post(this.authUrl, {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            audience: this.audience,
            grant_type: "client_credentials",
        });
        this.token = res.data.access_token;
        this.tokenExpiry = now + res.data.expires_in - 60; // buffer
        return this.token;
    }
    async request(method, url, data) {
        const token = await this.getAccessToken();
        return this.api.request({
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
export const reloadlyClient = new ReloadlyClient();
