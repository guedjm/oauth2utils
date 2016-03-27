"use strict";

export class ErrorManager extends Error {
  public httpStatus: number;
  public errorCode: number;
  public errorSubCode: number;
  public message: string;

  constructor(httpStatus: number, errorCode: number, message: string, errorSubCode?: number) {
    super(message);
    this.httpStatus = httpStatus;
    this.errorCode = errorCode;
    this.errorSubCode = errorSubCode;
  }

  public static invalidRequestError(): ErrorManager {
    return new ErrorManager(400, 1, "Invalid request");
  }

  public static internalServerError(): ErrorManager {
    return new ErrorManager(500, 1, "Internal server error");
  }
}
