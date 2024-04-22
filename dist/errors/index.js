"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceError = exports.SystemError = void 0;
const error_1 = require("./error");
class SystemError {
    static 10001 = new error_1.ErrorResponse(10001, 'system error');
    static 10002 = new error_1.ErrorResponse(10002, 'service unaviliable');
    static 10003 = new error_1.ErrorResponse(10003, 'params error');
}
exports.SystemError = SystemError;
class ServiceError {
    static 20001 = new error_1.ErrorResponse(20001, '用户名已存在');
    static 20002 = new error_1.ErrorResponse(20001, '用户名或密码错误');
    static 20003 = new error_1.ErrorResponse(20001, '验证码错误');
}
exports.ServiceError = ServiceError;
//# sourceMappingURL=index.js.map