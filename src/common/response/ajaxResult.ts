/**
 * @description 封装返回值对象
 */
export class AjaxResult {
  readonly code: number;
  readonly msg: string;
  readonly data: any;
  [key: string]: any;
  constructor(data: any, code: number, msg: string) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
  static success(data: any, msg = '操作成功') {
    return new AjaxResult(data, 200, msg);
  }
  static error(msg = '操作失败', code = 500) {
    return new AjaxResult(null, code, msg);
  }
}
