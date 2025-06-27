import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class CustomRpcExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException): Observable<any> {
    const errorResponse = {
      status: 'error',
      message: exception.message || 'An unexpected error occurred',
    };

    console.error('🚨 RPC Error:', errorResponse);

    return throwError(() => errorResponse);
  }
}
