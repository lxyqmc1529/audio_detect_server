"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioDTO = void 0;
const joi_1 = __importDefault(require("joi"));
exports.AudioDTO = {
    updateAudio: joi_1.default.object({
        result: joi_1.default.string().optional(),
        tag: joi_1.default.string().optional()
    }),
};
//# sourceMappingURL=audio.dto.js.map