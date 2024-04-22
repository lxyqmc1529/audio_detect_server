"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const router = new router_1.default({ prefix: '/v1/user' });
router.post('/register', user_controller_1.default.register);
router.get('/captcha', user_controller_1.default.getCaptcha);
router.post('/login', user_controller_1.default.login);
router.get('/', user_controller_1.default.getUserInfo);
exports.default = router;
//# sourceMappingURL=user.js.map