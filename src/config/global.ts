import { Context } from "koa";
import { PassThrough } from "stream";

export const SSEClient = new Set<PassThrough>();
