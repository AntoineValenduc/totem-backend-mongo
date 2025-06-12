import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

interface RpcErrorShape {
  message: string;
  errorCode?: string;
  status?: number;
}

@Injectable()
export class RpcToHttpInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof RpcException) {
          const error = err.getError();

          // Cas 1 : erreur de type RpcErrorShape (objet avec message + errorCode)
          if (typeof error === 'object' && error !== null && 'message' in error) {
            const e = error as RpcErrorShape;
            return throwError(() =>
              new HttpException(
                { message: e.message, errorCode: e.errorCode ?? 'UNEXPECTED_ERROR' },
                e.status ?? 500,
              ),
            );
          }

          // Cas 2 : string simple
          if (typeof error === 'string') {
            return throwError(() =>
              new HttpException({ message: error, errorCode: 'UNEXPECTED_ERROR' }, 500),
            );
          }
        }

        // Fallback si ce n’est pas un RpcException
        return throwError(() =>
          new HttpException({ message: 'Erreur interne', errorCode: 'INTERNAL_ERROR' }, 500),
        );
      }),
    );
  }
}
