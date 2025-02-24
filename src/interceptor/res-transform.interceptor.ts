import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AjaxResult } from '../common/response/ajaxResult';

/**
 * @description 响应拦截器，统一响应对象格式
 */
@Injectable()
export class ResTransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        return AjaxResult.success(data);
      }),
    );
  }
}
