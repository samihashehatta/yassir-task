import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
export interface FailedResponseModel {
  result: string | object;
  stack: string;
}
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const output: FailedResponseModel = {
      result: exception.getResponse() || exception.message,
      stack: exception.stack || undefined,
    };
    response.status(status).json(output);
  }
}
