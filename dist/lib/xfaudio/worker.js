"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const index_1 = require("./index");
const config_1 = require("../../config");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const audioSdk = new index_1.AudioSDK(config_1.XunFei.appId, config_1.XunFei.secret);
worker_threads_1.parentPort.on('message', (param) => {
    const filename = path_1.default.basename(param.fileKey);
    const filePath = path_1.default.resolve(process.cwd(), 'static', filename);
    console.log(filePath);
    if (fs_1.default.existsSync(filePath)) {
        audioSdk.audioDetect(filePath).then(result => {
            worker_threads_1.parentPort.postMessage({
                result,
                id: param.id,
                status: 'success',
            });
        }).catch((err) => {
            worker_threads_1.parentPort.postMessage({
                id: param.id,
                status: 'fail',
            });
        });
        return;
    }
    worker_threads_1.parentPort.postMessage({
        id: param.id,
        status: 'fail',
    });
});
//# sourceMappingURL=worker.js.map