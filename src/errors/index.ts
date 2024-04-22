import { ErrorResponse } from './error';

export class SystemError {
  static 10001 = new ErrorResponse(10001, 'system error');
  static 10002 = new ErrorResponse(10002, 'service unaviliable');
  static 10003 = new ErrorResponse(10003, 'params error');
}

export class ServiceError {
  static 20001 = new ErrorResponse(20001, '用户名已存在');
  static 20002 = new ErrorResponse(20001, '用户名或密码错误');
  static 20003 = new ErrorResponse(20001, '验证码错误');

}