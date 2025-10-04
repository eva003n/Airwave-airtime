interface IUser {
  avatar_id: null | string;
  avatar_url: null | string;
  createdAt: string;
  id: string;
  is_MFA_enabled: boolean;
  role: string;
  updatedAt: string;
  username: string;
  message: string
}

export type {
    IUser
}