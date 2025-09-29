//standadize success  responses

class ApiResponse {
  success: boolean;
  status: number;
  data: any;
  message: string;
    constructor(statusCode: number, data:any, message = "success") {
      this.success = statusCode < 400; //false if statusCode > 400
      this.status = statusCode;
      this.data = data;
      this.message = message;
   
    }
  }
  
  export default ApiResponse;
  