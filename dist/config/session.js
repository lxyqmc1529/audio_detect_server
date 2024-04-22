"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionConfig = void 0;
exports.sessionConfig = {
    key: "audio_detect:sess", //cookie的key,(默认是:koa:sess)
    maxAge: 1000 * 60 * 60 * 30,
    autoCommit: true,
    overwrite: true,
    httpOnly: false,
    signed: false,
    rolling: true,
    renew: false,
};
//# sourceMappingURL=session.js.map