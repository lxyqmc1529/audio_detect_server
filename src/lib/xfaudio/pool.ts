import { StaticPool } from 'node-worker-threads-pool';
import path from 'path';
import os from 'os';
import { Audio } from '@app/models';
import { retryAxiosRequest } from '@app/utils/tools';

interface AudioDetectResult {
  id: string;
  status: 'success' | 'fail',
  result?: string;
  tag?: string;
}
export class AudioTask {
  audioPool: StaticPool<any>;
  audios: Audio[];
  taskNum: number;
  done = 0;
  callback: (result: AudioDetectResult, done: boolean) => void;
  constructor(audios: Audio[], callback: (result: AudioDetectResult, done: boolean) => void) {
    this.audios = audios;
    this.taskNum = audios.length;
    this.callback = callback;
    this.audioPool = new StaticPool({
      size: os.cpus().length,
      task: path.resolve(__dirname, './worker'),
    });
  }

  async textClassification(text: string) {
    try {
      const res = await retryAxiosRequest({
        url: 'http://127.0.0.1:5000/text-classification',
        method: 'POST',
        data: {
          text: text
        }
      });
      if (res.data.errno === 0) {
        return res.data.data;
      }
    } finally {
      return '';
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
      result.tag = await this.textClassification(result.result);
    }
    const isDone = this.done === this.taskNum;
    this.callback(result, isDone);
    if (!isDone) {
      this.startAudioTask();
    } else {
      // 处理结束，关闭处理线程
      this.audioPool.destroy();
    }
  }
  
  runTask() {
    const maxConcurrent = os.cpus().length;
    for (let idx = 0; idx < maxConcurrent; idx++) {
      this.startAudioTask();
    }
  }
}
