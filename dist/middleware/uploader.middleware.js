"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = void 0;
async function uploader(ctx, next) {
    console.log(ctx.req.files);
    await next();
}
exports.uploader = uploader;
//# sourceMappingURL=uploader.middleware.js.map