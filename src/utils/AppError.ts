class AppError extends Error {
  statusCode: number;
  errorType: string;

  constructor(statusCode: number, errorType: string, message: string) {
    super(message);

    this.statusCode = statusCode;
    this.errorType = errorType;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;