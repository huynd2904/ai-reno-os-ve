import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResult } from '../models/api-result';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // Nếu là HttpException (Nest mặc định)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Một số exception có message dạng string hoặc object
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const msg = (exceptionResponse as any).message;
        message = Array.isArray(msg) ? msg.join(', ') : msg || message;
      }
    } else if (exception instanceof Error) {
      // Nếu là lỗi JS thường (TypeError, ReferenceError,...)
      message = exception.message;
    }

    const apiResult = ApiResult.failure(message);
    response.status(status).json(apiResult);
  }
}
