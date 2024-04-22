"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDTO = void 0;
const joi_1 = __importDefault(require("joi"));
exports.UserDTO = {
    registerDto: joi_1.default.object({
        username: joi_1.default.string().min(3).max(30).required(),
        password: joi_1.default.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    }),
    loginDto: joi_1.default.object({
        username: joi_1.default.string().min(3).max(30).required(),
        password: joi_1.default.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        captcha: joi_1.default.string().length(4).required(),
    })
};
//# sourceMappingURL=user.dto.js.map