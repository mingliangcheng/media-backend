/**
 * @description 异常过滤器
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AjaxResult } from '../common/response/ajaxResult';
import { Response, Request } from 'express';
import { Log } from '../share/log4js';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string;
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      message = (response as any)?.message ?? response;
    } else {
      message = `${exception}`;
    }
    response.status(status).json(AjaxResult.error(message, status));
    const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    Request original url: ${request.originalUrl}
    Method: ${request.method}
    IP: ${request.ip}
    Status code: ${status}
    Response: ${exception}
       <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    `;
    Log.error(logFormat);
  }
}
