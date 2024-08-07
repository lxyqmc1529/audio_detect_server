"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./user"));
const audio_1 = __importDefault(require("./audio"));
function createRouter(app) {
    app.use(user_1.default.routes()).use(user_1.default.allowedMethods());
    app.use(audio_1.default.routes()).use(audio_1.default.allowedMethods());
}
exports.default = createRouter;
//# sourceMappingURL=index.js.map