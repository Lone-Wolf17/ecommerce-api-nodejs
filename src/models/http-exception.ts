export default class HttpException extends Error {
    statusCode?: number;
    status?: number;
    message: string;
    error?: string | null;
    data?: unknown[];
  
    constructor(statusCode: number, message: string, data?: unknown[]) {
      super(message);
  
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
    }
  }