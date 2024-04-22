"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sse = void 0;
const global_1 = require("../config/global");
const stream_1 = require("stream");
async function sse(ctx) {
    ctx.request.socket.setTimeout(0);
    ctx.req.socket.setNoDelay(true);
    ctx.req.socket.setKeepAlive(true);
    ctx.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });
    const stream = new stream_1.PassThrough();
    ctx.status = 200;
    ctx.body = stream;
    global_1.SSEClient.add(stream);
    console.log('new sse client connected. total clients: ', global_1.SSEClient.size);
    // setInterval(() => {
    //   stream.write(`data: ${new Date()}`);
    // }, 2000)
    ctx.req.on('close', () => {
        global_1.SSEClient.delete(stream);
        console.log(`Client disconnected. Total clients: ${global_1.SSEClient.size}`);
    });
}
exports.sse = sse;
//# sourceMappingURL=sse.middleware.js.map