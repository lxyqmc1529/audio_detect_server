import { parentPort, workerData } from 'worker_threads';
import { AudioSDK } from './index';
import { XunFei } from '@app/config';
import { Audio } from '@app/models';
import path from 'path';
import fs from 'fs';

const audioSdk = new AudioSDK(XunFei.appId, XunFei.secret);
parentPort.on('message', (param: Audio) => {
  const filename = path.basename(param.fileKey);
  const filePath = path.resolve(process.cwd(), 'static', filename);
  console.log(filePath);
  if (fs.existsSync(filePath)) {
    audioSdk.audioDetect(filePath).then(result => {
      parentPort.postMessage({
        result,
        id: param.id,
        status: 'success',
      });
    }).catch((err) => {
      parentPort.postMessage({
        id: param.id,
        status: 'fail',
      });
    })
    return;
  }
  parentPort.postMessage({
    id: param.id,
    status: 'fail',
  });
});