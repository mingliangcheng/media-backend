/**
 * @description 日志中间件
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Log } from '../share/log4js';
@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: any) => void): any {
    const code = res.statusCode; //响应状态吗
    next();
    //  组装日志信息
    const logFormat = `Method:${req.method}
      Request original url: ${req.originalUrl}
      IP:${req.ip}
      Status code:${code} `;
    // 根据状态码进行日志类型区分
    if (code >= 500) {
      Log.error(logFormat);
    } else if (code >= 400) {
      Log.warn(logFormat);
    } else {
      Log.access(logFormat);
      Log.log(logFormat);
    }
  }
}

// 函数式中间件
export function logger(req: Request, res: Response, next: () => any) {
  const code = res.statusCode; //响应状态码
  next();
  // 组装日志信息
  const logFormat = `请求参数
  Request original url: ${req.originalUrl}
  Method: ${req.method}
  IP: ${req.ip}
  Status code: ${code}
  Params: ${JSON.stringify(req.params)}
  Query: ${JSON.stringify(req.query)}
  Body: ${JSON.stringify(req.body)} \n`;
  //根据状态码，进行日志类型区分
  if (code >= 500) {
    Log.error(logFormat);
  } else if (code >= 400) {
    Log.warn(logFormat);
  } else {
    Log.access(logFormat);
    Log.log(logFormat);
  }
}
