import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class CustomHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      statusCode: status,
      message: this.getErrorMessage(exception),
      error: this.getErrorDescription(exception),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    console.error('🚨 HTTP Error:', errorResponse);

    response.status(status).json(errorResponse);
  }

  private getErrorMessage(exception: HttpException): string {
    const response = exception.getResponse();
    if (typeof response === 'string') {
      return response;
    }

    if (typeof response === 'object' && response !== null) {
      const { message } = response as { message?: string | string[] };
      if (Array.isArray(message)) {
        return message.join(', ');
      }
      if (typeof message === 'string') {
        return message;
      }
    }

    return exception.message || 'An unexpected error occurred';
  }

  private getErrorDescription(exception: HttpException): string {
    const response = exception.getResponse();
    if (typeof response === 'object' && response !== null) {
      const { error } = response as { error?: string };
      if (typeof error === 'string') {
        return error;
      }
    }

    return exception.message || 'An unexpected error occurred';
  }
}
