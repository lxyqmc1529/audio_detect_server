"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Audio = exports.AudioStatus = void 0;
const typeorm_1 = require("typeorm");
const base_model_1 = require("./base.model");
var AudioStatus;
(function (AudioStatus) {
    AudioStatus["wait"] = "wait";
    AudioStatus["success"] = "success";
    AudioStatus["fail"] = "fail";
})(AudioStatus || (exports.AudioStatus = AudioStatus = {}));
let Audio = class Audio extends base_model_1.BaseModel {
    filename;
    // 音频文件存储路径
    fileKey;
    result;
    status;
    hash;
    tag;
    line;
    address;
};
exports.Audio = Audio;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Audio.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Audio.prototype, "fileKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Audio.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: [AudioStatus.wait, AudioStatus.success, AudioStatus.fail], default: AudioStatus.wait }),
    __metadata("design:type", String)
], Audio.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Audio.prototype, "hash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Audio.prototype, "tag", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Audio.prototype, "line", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Audio.prototype, "address", void 0);
exports.Audio = Audio = __decorate([
    (0, typeorm_1.Entity)()
], Audio);
//# sourceMappingURL=audio.model.js.map