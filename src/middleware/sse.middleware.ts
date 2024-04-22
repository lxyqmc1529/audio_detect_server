import { Context } from "koa";
import { SSEClient } from '@app/config/global';
import { PassThrough } from "stream";

export async function sse(ctx: Context) {
  ctx.request.socket.setTimeout(0);
  ctx.req.socket.setNoDelay(true);
  ctx.req.socket.setKeepAlive(true);
  ctx.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  const stream = new PassThrough();
  ctx.status = 200;
  ctx.body = stream;
  SSEClient.add(stream);
  console.log('new sse client connected. total clients: ', SSEClient.size);

  // setInterval(() => {
  //   stream.write(`data: ${new Date()}`);
  // }, 2000)

  ctx.req.on('close', () => {
    SSEClient.delete(stream);
    console.log(`Client disconnected. Total clients: ${SSEClient.size}`);
  });
}