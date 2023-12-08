export default class BadRequestError extends Error {
  errorMessage: string;

  statusCode: number;

  constructor(message: string | object) {
    const err = typeof message === "string" ? message : JSON.stringify(message);
    super(typeof message === "string" ? message : JSON.stringify(message));
    this.errorMessage = err;

    this.statusCode = 400;
  }
}
