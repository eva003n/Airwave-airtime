//standadize success  responses
class ApiResponse {
    success;
    status;
    data;
    message;
    constructor(statusCode, data, message = "success") {
        this.success = statusCode < 400; //false if statusCode > 400
        this.status = statusCode;
        this.data = data;
        this.message = message;
    }
}
export default ApiResponse;
