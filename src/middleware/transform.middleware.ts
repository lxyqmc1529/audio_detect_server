import { Context } from 'koa';
import { ErrorResponse } from '@app/errors/error';
import Joi from 'joi';

export default function transformResponse() {
  return async function (ctx: Context, next: () => any) {
    ctx.success = function(data: any,) {
      ctx.type = 'application/json';
      ctx.body = {
        code: 0,
        message: 'success',
        data: data,
      };
    }
    ctx.fail = function(message: string | Error | ErrorResponse | Joi.ValidationError, code?: number) {
      ctx.type = 'application/json';
      // validate 返回
      if (message instanceof Joi.ValidationError) {
        const errmsg = message.details.map(item => item.message).join('\n');
        ctx.body = {
          code: 10003,
          message: errmsg,
          data: null,
        };
        return;
      }
      const errcode = code || (message instanceof ErrorResponse ? message.errcode : -1);
      const errmsg = message instanceof ErrorResponse 
        ? message.errmsg
        : message instanceof Error
        ? message.message
        : message;
      ctx.body = {
        code: errcode,
        message: errmsg,
        data: null,
      };
    }

    await next();
  }
}