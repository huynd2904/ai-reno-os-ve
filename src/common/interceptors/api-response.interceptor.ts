import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResult } from '../models/api-result';

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResult<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResult<T>> {
    return next.handle().pipe(
      map((data) => {
        // Nếu response đã là ApiResult thì giữ nguyên
        if (data instanceof ApiResult) return data;
        return ApiResult.success(data);
      }),
    );
  }
}
