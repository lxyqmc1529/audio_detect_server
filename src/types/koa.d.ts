import Koa from 'koa';
import { ErrorResponse } from '@app/errors/error';
import Joi from 'joi';

declare module 'koa' {
  interface Context {
    success(data: any): void;
    fail(message: string | Error | ErrorResponse | Joi.ValidationError, code?: number): void;
  }
}