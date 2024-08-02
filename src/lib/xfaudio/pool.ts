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
  line?: string[];
  address?: string[];
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
      if (res.data.errno !== 0) {
        throw Error('分类失败');
      }
      return res.data.data;
    } catch(err) {
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
        result.line = Array.from(new Set(line));
        result.address = Array.from(new Set(address));
      }
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
