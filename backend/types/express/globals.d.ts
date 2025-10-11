import User from "./src/models/User.js"

declare global {
    namespace Express {
        interface Request {
          user: User;
          cookies: {
            AccessToken: string;
            RefreshToken: string;
          };
          query: {
            page?: number;
            limit?: number;
            [key: string]: any;
          };
        }
    }
}

export {}