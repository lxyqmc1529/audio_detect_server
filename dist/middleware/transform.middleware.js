"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../errors/error");
const joi_1 = __importDefault(require("joi"));
function transformResponse() {
    return async function (ctx, next) {
        ctx.success = function (data) {
            ctx.type = 'application/json';
            ctx.body = {
                code: 0,
                message: 'success',
                data: data,
            };
        };
        ctx.fail = function (message, code) {
            ctx.type = 'application/json';
            // validate 返回
            if (message instanceof joi_1.default.ValidationError) {
                const errmsg = message.details.map(item => item.message).join('\n');
                ctx.body = {
                    code: 10003,
                    message: errmsg,
                    data: null,
                };
                return;
            }
            const errcode = code || (message instanceof error_1.ErrorResponse ? message.errcode : -1);
            const errmsg = message instanceof error_1.ErrorResponse
                ? message.errmsg
                : message instanceof Error
                    ? message.message
                    : message;
            ctx.body = {
                code: errcode,
                message: errmsg,
                data: null,
            };
        };
        await next();
    };
}
exports.default = transformResponse;
//# sourceMappingURL=transform.middleware.js.map