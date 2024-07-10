"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = require("../lib/xfaudio/pool");
const audio_service_1 = __importDefault(require("../service/audio.service"));
const dto_1 = require("../dto");
const global_1 = require("../config/global");
const tools_1 = require("../utils/tools");
const fs_1 = __importDefault(require("fs"));
class AudioController {
    constructor() { }
    async uploadAudio(ctx) {
        const files = ctx.req.files;
        const results = [];
        const audioFiles = (await Promise.all(files.map(async (file) => {
            const hash = await (0, tools_1.calculateFileHash)(file.path);
            const exsistAudio = await audio_service_1.default.findByHash(hash);
            if (exsistAudio) {
                results.push(exsistAudio);
                fs_1.default.unlinkSync(file.path);
                return;
            }
            return {
                fileKey: `/public/${file.filename}`,
                hash: await (0, tools_1.calculateFileHash)(file.path),
                filename: file.originalname,
            };
        }))).filter(Boolean);
        results.push(...await audio_service_1.default.inserts(audioFiles));
        ctx.success(results);
    }
    async detectAudio(ctx) {
        const { ids } = ctx.request.body;
        const audios = await audio_service_1.default.findByIds(ids);
        const audioTask = new pool_1.AudioTask(audios, async (data, done) => {
            const { id, status, result, tag } = data;
            const audioInfo = await audio_service_1.default.findById(id);
            if (audioInfo) {
                Object.assign(audioInfo, {
                    status,
                    result,
                    tag,
                });
                await audio_service_1.default.save(audioInfo);
            }
            global_1.SSEClient.forEach((stream) => {
                stream.write(`data: ${JSON.stringify({
                    audioInfo,
                    done
                })}\n\n`);
            });
        });
        audioTask.runTask();
        ctx.success(undefined);
    }
    async getAllAudios(ctx) {
        const query = ctx.request.query;
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const audios = await audio_service_1.default.getAll(page, limit);
        ctx.success(audios);
    }
    async updateAudioInfo(ctx) {
        const id = ctx.params.id;
        const audio = await audio_service_1.default.findById(id);
        if (!audio) {
            throw new Error('音频数据不存在');
        }
        const body = ctx.request.body;
        // 校验数据是否合法
        const { error } = dto_1.AudioDTO.updateAudio.validate(body);
        if (error) {
            return ctx.fail(error);
        }
        Object.assign(audio, body);
        const updateRes = await audio_service_1.default.save(audio);
        ctx.success(updateRes);
    }
}
exports.default = new AudioController();
//# sourceMappingURL=audio.controller.js.map