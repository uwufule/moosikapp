interface IAPIError extends Error {
  statusCode: number;
  message: string;
}

export default class APIError implements IAPIError {
  readonly name: string;

  readonly statusCode: number;

  readonly message: string;

  constructor(statusCode: number, message: string) {
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.message = message;
  }
}
