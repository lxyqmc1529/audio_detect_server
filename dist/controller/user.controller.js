"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const svg_captcha_1 = __importDefault(require("svg-captcha"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = __importDefault(require("../service/user.service"));
const dto_1 = require("../dto");
const config_1 = require("../config");
const errors_1 = require("../errors");
class UserController {
    async getCaptcha(ctx) {
        const cap = svg_captcha_1.default.create({
            size: 4,
            width: 120,
            height: 40,
            fontSize: 45,
            ignoreChars: "0oO1ilI",
            noise: 3,
            color: true,
            background: "#eee",
        });
        const img = Buffer.from(cap.data).toString("base64");
        const base64Img = "data:image/svg+xml;base64," + img;
        const text = cap.text.toLowerCase();
        ctx.session.captcha = text;
        ctx.success({
            imgUrl: base64Img,
        });
    }
    async register(ctx) {
        // 获取请求数据
        const data = ctx.request.body;
        // 校验数据是否合法
        const { error } = dto_1.UserDTO.registerDto.validate(data);
        if (error) {
            return ctx.fail(error);
        }
        // 判断用户名是否已经存在
        const hasUser = await user_service_1.default.findByName(data.username);
        if (hasUser) {
            return ctx.fail(errors_1.ServiceError[20001]);
        }
        // 密码加密存储
        data.password = bcrypt_1.default.hashSync(data.password, 10);
        // 存储用户信息
        const saveUser = await user_service_1.default.save(data);
        delete saveUser.password;
        ctx.success(saveUser);
    }
    async login(ctx) {
        const data = ctx.request.body;
        // 校验数据是否合法
        const { error } = dto_1.UserDTO.loginDto.validate(data);
        if (error) {
            return ctx.fail(error);
        }
        // 验证码校验
        if (data.captcha.toLowerCase() !== ctx.session.captcha?.toLowerCase()) {
            return ctx.fail(errors_1.ServiceError[20003]);
        }
        const userInfo = await user_service_1.default.findByName(data.username);
        if (!userInfo) {
            return ctx.fail(errors_1.ServiceError[20002]);
        }
        if (!bcrypt_1.default.compareSync(data.password, userInfo.password)) {
            return ctx.fail(errors_1.ServiceError[20002]);
        }
        const token = jsonwebtoken_1.default.sign({
            id: userInfo.id,
            username: userInfo.username,
        }, config_1.APP.jwtKey, {
            expiresIn: '24h'
        });
        return ctx.success({ token });
    }
    async getUserInfo(ctx) {
        const tokenUser = ctx.state.user;
        const userInfo = await user_service_1.default.findById(tokenUser.id);
        delete userInfo.password;
        return ctx.success(userInfo);
    }
}
exports.default = new UserController();
//# sourceMappingURL=user.controller.js.map