class HttpError extends Error {
  statusCode: number;
  responseMessage: string;

  constructor(
    message: string,
    statusCode: number,
    responseMessage: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.responseMessage = responseMessage || message;
    this.name = this.constructor.name;
  }
}

export class BadRequestError extends HttpError {
  constructor(responseMessage: string = "") {
    super("Bad Request", 400, responseMessage);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(responseMessage: string = "") {
    super("Unauthorized", 401, responseMessage);
  }
}

export class ForbiddenError extends HttpError {
  constructor(responseMessage: string = "") {
    super("Forbidden", 403, responseMessage);
  }
}

export class NotFoundError extends HttpError {
  constructor(responseMessage: string = "") {
    super("Not Found", 404, responseMessage);
  }
}

export class ConflictError extends HttpError {
  constructor(responseMessage: string = "") {
    super("Conflict", 409, responseMessage);
  }
}

export class RequestTooLongError extends HttpError {
  constructor(responseMessage: string = "") {
    super("Request Too Long", 413, responseMessage);
  }
}

export class InternalServerError extends HttpError {
  constructor(responseMessage: string = "") {
    super("Internal Server Error", 500, responseMessage);
  }
}
