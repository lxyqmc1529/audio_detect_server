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