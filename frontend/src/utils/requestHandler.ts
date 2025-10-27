import  { AxiosError, type AxiosResponse } from "axios";

const requestHandler = (
  api: () => Promise<any>,
  success: (res: AxiosResponse) => AxiosResponse,
  error: (err: AxiosError<{ message: string }>) => AxiosError
) => {
  return api()
    .then(success)
    .catch(error);
};


export default requestHandler

