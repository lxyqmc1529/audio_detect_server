import { Context } from "koa";
import { AudioTask } from '@app/lib/xfaudio/pool';
import audioService from '@app/service/audio.service';
import { AudioDTO } from '@app/dto';
import { SSEClient } from '@app/config/global';
import { calculateFileHash } from '@app/utils/tools';
import { Audio } from "@app/models";
import fs from 'fs';

class AudioController {
  constructor() {}

  async uploadAudio(ctx: Context) {
    const files = (ctx.req as any).files;
    const results: Audio[] = [];
    const audioFiles = (await Promise.all(files.map(async (file: any) => {
      const hash = await calculateFileHash(file.path);
      const exsistAudio = await audioService.findByHash(hash);
      if (exsistAudio) {
        results.push(exsistAudio);
        fs.unlinkSync(file.path);
        return;
      }
      return {
        fileKey: `/public/${file.filename}`,
        hash: await calculateFileHash(file.path),
        filename: file.originalname,
      }
    }))).filter(Boolean);
    results.push(...await audioService.inserts(audioFiles))
    ctx.success(results);
  }

  async detectAudio(ctx: Context) {
    const { ids } = ctx.request.body as { ids: string[] };
    const audios = await audioService.findByIds(ids);
    const audioTask = new AudioTask(audios, async (data, done) => {
      const { id, status, result, tag } = data;
      const audioInfo = await audioService.findById(id);
      if (audioInfo) {
        Object.assign(audioInfo, {
          status,
          result,
          tag,
        });
        await audioService.save(audioInfo);
      }
      SSEClient.forEach((stream) => {
        stream.write(`data: ${JSON.stringify({
          audioInfo,
          done
        })}\n\n`);
      });
    });
    audioTask.runTask();
    ctx.success(undefined);
  }

  async getAllAudios(ctx: Context) {
    const query = ctx.request.query;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const audios = await audioService.getAll(page, limit);
    ctx.success(audios);
  }

  async updateAudioInfo(ctx: Context) {
    const id = ctx.params.id;
    const audio = await audioService.findById(id);
    if (!audio) {
      throw new Error('音频数据不存在');
    }
    const body = ctx.request.body;
    // 校验数据是否合法
    const { error } = AudioDTO.updateAudio.validate(body);
    if (error) {
      return ctx.fail(error);
    }
    Object.assign(audio, body);
    const updateRes = await audioService.save(audio);
    ctx.success(updateRes);
  }
}

export default new AudioController();