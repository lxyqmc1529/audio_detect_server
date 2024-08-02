"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioTask = void 0;
const node_worker_threads_pool_1 = require("node-worker-threads-pool");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const tools_1 = require("../../utils/tools");
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
    async textClassification(text) {
        try {
            const res = await (0, tools_1.retryAxiosRequest)({
                url: 'http://127.0.0.1:5000/text-classification',
                method: 'POST',
                data: {
                    text: text
                }
            });
            if (res.data.errno !== 0) {
                throw Error('分类失败');
            }
            return res.data.data;
        }
        catch (err) {
            return null;
        }
    }
    async startAudioTask() {
        const audio = this.audios.shift();
        if (!audio) {
            return;
        }
        const result = await this.audioPool.exec(audio);
        this.done++;
        if (result.status === 'success' && result.result) {
            // result.tag = await this.textClassification(result.result);
            // console.log('等待分类结果',await this.textClassification(result.result))
            const processData = await this.textClassification(result.result);
            if (processData) {
                const { tag, line, address } = processData;
                result.tag = tag;
                result.line = line;
                result.address = address;
            }
        }
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