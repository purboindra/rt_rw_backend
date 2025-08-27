export class AppError extends Error {
  statusCode: number;
  publicMessage?: string;
  constructor(message: string, statusCode: number, publicMessage?: string) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.publicMessage = publicMessage;
  }
}
