"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryAxiosRequest = exports.calculateFileHash = exports.sleep = exports.parseJSONWithCatch = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
function parseJSONWithCatch(str, defaultValue = {}) {
    try {
        return JSON.parse(str);
    }
    catch (err) {
        return defaultValue;
    }
}
exports.parseJSONWithCatch = parseJSONWithCatch;
function sleep(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}
exports.sleep = sleep;
function calculateFileHash(filePath, algorithm = 'sha256') {
    return new Promise((resolve, reject) => {
        const hash = crypto_1.default.createHash(algorithm);
        const stream = fs_1.default.createReadStream(filePath);
        stream.on('data', (data) => {
            hash.update(data);
        });
        stream.on('end', () => {
            resolve(hash.digest('hex'));
        });
        stream.on('error', (err) => {
            reject(err);
        });
    });
}
exports.calculateFileHash = calculateFileHash;
function retryAxiosRequest(config, maxRetries = 3) {
    return new Promise((resolve, reject) => {
        (0, axios_1.default)(config)
            .then(response => {
            if (response.status === 200 && response.data.errno === 0) {
                resolve(response);
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
exports.retryAxiosRequest = retryAxiosRequest;
//# sourceMappingURL=tools.js.map