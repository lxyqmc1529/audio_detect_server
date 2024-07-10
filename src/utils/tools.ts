import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import crypto from 'crypto';
import fs from 'fs';

export function parseJSONWithCatch(str: string, defaultValue = {}) {
  try {
    return JSON.parse(str);
  } catch(err) {
    return defaultValue;
  }
}

export function sleep(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  })
}

export function calculateFileHash(filePath: string, algorithm = 'sha256') {
  return new Promise<string>((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => {
      hash.update(data);
    });
    stream.on('end', () => {
      resolve(hash.digest('hex'));
    });
    stream.on('error', (err) => {
      reject(err);
    })
  })
}

export function retryAxiosRequest(config: AxiosRequestConfig & { __retryCount?: number }, maxRetries = 3) {
  return new Promise<AxiosResponse<any>>((resolve, reject) => {
    axios(config)
      .then(response => {
        if (response.status === 200 && response.data.errno === 0) {
          resolve(response)
        }
        throw new Error(response.data.errno);
      })
      .catch(error => {
        if (config.__retryCount < maxRetries) {
          config.__retryCount += 1;
          console.log(`重试次数：${config.__retryCount}`);
          return retryAxiosRequest(config, maxRetries);
        }
        reject(error);
      });
  });
}