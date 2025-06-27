import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  readonly errorCode: string;

  constructor(message: string, errorCode: string, status: HttpStatus) {
    super({ message, errorCode }, status);
    //super(message, code, status, { context: 'profile-service', id }) A envoyer dans le front
    this.errorCode = errorCode;
  }
}
