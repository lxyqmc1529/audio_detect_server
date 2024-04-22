import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import querystring from 'querystring';
import axios from 'axios';
import { HOST, API } from './constants';
import { parseJSONWithCatch, sleep } from '@app/utils/tools';

export class AudioSDK {
  private appid: string;
  private secret: string;
  private ts: number;
  private signa: string;
  constructor(appid: string, secret: string) {
    this.appid = appid;
    this.secret = secret;
    this.ts = parseInt((new Date().getTime() / 1000).toString());
    this.signa = this.getSigna();
  }

  private getSigna() {
    const baseStr = this.appid + this.ts;
    const hash = crypto.createHash('md5');
    hash.update(baseStr, 'utf8');
    const md5 = Buffer.from(hash.digest('hex'), 'utf8');
    const hmac = crypto.createHmac('sha1', this.secret);
    hmac.update(md5);
    const signa = hmac.digest();
    return signa.toString('base64');
  }

  async upload(file: string) {
    const fileData = fs.readFileSync(file);
    const fileLen = fileData.length;
    const fileName = path.basename(file);
    const params = {
      appId: this.appid,
      signa: this.signa,
      ts: this.ts,
      fileSize: fileLen,
      fileName: fileName,
      duration: 200,
      roleType: 1,
      roleNum: 2,
    };
    const requestURL = `${HOST + API.upload}?${querystring.stringify(params)}`;
    const result = await axios({
      method: 'POST',
      url: requestURL,
      data: fileData,
      headers: {
        "Content-type": "application/json"
      }
    });
    return result.data;
  }

  convertAudioResultData(result: Array<any>) {
    const content = [];
    let lastPrompt = null;
    for (const item of result) {
      const current = item['json_1best'];
      const curPrompt = current["st"]["rl"];
      let currentText = '';
      for (const rt of current['st']['rt']) {
        for (const ws of rt['ws']) {
          for (const cw of ws['cw']) {
            currentText += cw['w'];
          }
        }
      }
      if (lastPrompt === null) {
        lastPrompt = {
          "prompt": curPrompt,
          "text": currentText,
        };
        continue;
      } else if (curPrompt === lastPrompt["prompt"]) {
        lastPrompt["text"] += currentText;
      } else {
        content.push(lastPrompt);
        lastPrompt = {
          "prompt": curPrompt,
          "text": currentText,
        };
      }
    }
    content.push(lastPrompt);
    return content;
  }

  async getSingleAudioResult(orderId: string) {
    const params = {
      orderId: orderId,
      appId: this.appid,
      signa: this.signa,
      ts: this.ts,
      resultType: 'transfer,predict',
    };
    const requestURL = `${HOST + API.getResult}?${querystring.stringify(params)}`;
    const result = await axios({
      method: 'POST',
      url: requestURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return result.data;
  }

  getAudioDetectResult(orderId: string) {
    return new Promise<string>(async (resolve, reject) => {
      let result: any;
      do {
        result = await this.getSingleAudioResult(orderId);
        if ([4, -1].includes(result.content?.orderInfo?.status)) {
          break;
        }
        await sleep(3000);
      } while(result.content?.orderInfo?.status === 3)

      if (result.content?.orderInfo?.status === -1) {
        reject(new Error('音频转码失败'));
        return;
      }
      const orderResult = parseJSONWithCatch(result.content?.orderResult);
      const detectResult = this.convertAudioResultData(orderResult.lattice2 || []);
      const detectText = detectResult.reduce((str, item) => {
        return str + `${item.prompt}: ${item.text}\n`;
      }, '');
      resolve(detectText);
    })
  }

  async audioDetect(file: string) {
    const orderInfo = await this.upload(file);
    const orderId = orderInfo.content?.orderId;
    if (!orderId) {
      throw new Error('创建音频转码订单失败');
    }
    return await this.getAudioDetectResult(orderId);
  }
}