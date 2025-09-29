interface ISignUp {
    userName: string,
    email: string,
    password: string
}

interface ILogin {
    userName: string,
    password: string
}

interface IVerifyEmail {
  verification_code: string;
  user_id: string;
}
interface IVerifyOtp {
    verification_code: string;
    user_id: string
}
export type {
    ISignUp,
    ILogin,
    IVerifyEmail,
    IVerifyOtp
}