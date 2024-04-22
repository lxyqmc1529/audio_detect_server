"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioTask = void 0;
const node_worker_threads_pool_1 = require("node-worker-threads-pool");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
class AudioTask {
    audioPool;
    audios;
    taskNum;
    done = 0;
    callback;
    constructor(audios, callback) {
        this.audios = audios;
        this.taskNum = audios.length;
        this.callback = callback;
        this.audioPool = new node_worker_threads_pool_1.StaticPool({
            size: os_1.default.cpus().length,
            task: path_1.default.resolve(__dirname, './worker'),
        });
    }
    async startAudioTask() {
        const audio = this.audios.shift();
        if (!audio) {
            return;
        }
        const result = await this.audioPool.exec(audio);
        this.done++;
        const isDone = this.done === this.taskNum;
        this.callback(result, isDone);
        if (!isDone) {
            this.startAudioTask();
        }
        else {
            // 处理结束，关闭处理线程
            this.audioPool.destroy();
        }
    }
    runTask() {
        const maxConcurrent = os_1.default.cpus().length;
        for (let idx = 0; idx < maxConcurrent; idx++) {
            this.startAudioTask();
        }
    }
}
exports.AudioTask = AudioTask;
//# sourceMappingURL=pool.js.map