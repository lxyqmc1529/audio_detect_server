"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioSDK = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const querystring_1 = __importDefault(require("querystring"));
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants");
const tools_1 = require("../../utils/tools");
class AudioSDK {
    appid;
    secret;
    ts;
    signa;
    constructor(appid, secret) {
        this.appid = appid;
        this.secret = secret;
        this.ts = parseInt((new Date().getTime() / 1000).toString());
        this.signa = this.getSigna();
    }
    getSigna() {
        const baseStr = this.appid + this.ts;
        const hash = crypto_1.default.createHash('md5');
        hash.update(baseStr, 'utf8');
        const md5 = Buffer.from(hash.digest('hex'), 'utf8');
        const hmac = crypto_1.default.createHmac('sha1', this.secret);
        hmac.update(md5);
        const signa = hmac.digest();
        return signa.toString('base64');
    }
    async upload(file) {
        const fileData = fs_1.default.readFileSync(file);
        const fileLen = fileData.length;
        const fileName = path_1.default.basename(file);
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
        const requestURL = `${constants_1.HOST + constants_1.API.upload}?${querystring_1.default.stringify(params)}`;
        const result = await (0, axios_1.default)({
            method: 'POST',
            url: requestURL,
            data: fileData,
            headers: {
                "Content-type": "application/json"
            }
        });
        return result.data;
    }
    convertAudioResultData(result) {
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
            }
            else if (curPrompt === lastPrompt["prompt"]) {
                lastPrompt["text"] += currentText;
            }
            else {
                content.push(lastPrompt);
                lastPrompt = {
                    "prompt": curPrompt,
                    "text": currentText,
                };
            }
        }
        lastPrompt && content.push(lastPrompt);
        return content;
    }
    async getSingleAudioResult(orderId) {
        const params = {
            orderId: orderId,
            appId: this.appid,
            signa: this.signa,
            ts: this.ts,
            resultType: 'transfer,predict',
        };
        const requestURL = `${constants_1.HOST + constants_1.API.getResult}?${querystring_1.default.stringify(params)}`;
        const result = await (0, axios_1.default)({
            method: 'POST',
            url: requestURL,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return result.data;
    }
    getAudioDetectResult(orderId) {
        return new Promise(async (resolve, reject) => {
            let result;
            do {
                result = await this.getSingleAudioResult(orderId);
                if ([4, -1].includes(result.content?.orderInfo?.status)) {
                    break;
                }
                await (0, tools_1.sleep)(3000);
            } while (result.content?.orderInfo?.status === 3);
            if (result.content?.orderInfo?.status === -1) {
                reject(new Error('音频转码失败'));
                return;
            }
            const orderResult = (0, tools_1.parseJSONWithCatch)(result.content?.orderResult);
            const detectResult = this.convertAudioResultData(orderResult.lattice2 || []);
            const detectText = detectResult.filter(Boolean).reduce((str, item) => {
                return str + `${item?.prompt}: ${item?.text}\n`;
            }, '');
            resolve(detectText);
        });
    }
    async audioDetect(file) {
        const orderInfo = await this.upload(file);
        const orderId = orderInfo.content?.orderId;
        if (!orderId) {
            throw new Error('创建音频转码订单失败');
        }
        return await this.getAudioDetectResult(orderId);
    }
}
exports.AudioSDK = AudioSDK;
//# sourceMappingURL=index.js.map