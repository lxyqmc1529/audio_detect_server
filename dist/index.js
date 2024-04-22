"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const cors_1 = __importDefault(require("@koa/cors"));
const bodyparser_1 = __importDefault(require("@koa/bodyparser"));
const koa_session_1 = __importDefault(require("koa-session"));
const koa_jwt_1 = __importDefault(require("koa-jwt"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa_mount_1 = __importDefault(require("koa-mount"));
const path_1 = __importDefault(require("path"));
const transform_middleware_1 = __importDefault(require("./middleware/transform.middleware"));
const routes_1 = __importDefault(require("./routes"));
const bootstrap_1 = require("./lib/bootstrap");
const config_1 = require("./config");
require("reflect-metadata");
(0, bootstrap_1.bootstrap)().then(() => {
    const app = new koa_1.default();
    // 跨域中间件
    app.use((0, cors_1.default)({
        credentials: true,
    }));
    app.use((0, bodyparser_1.default)());
    app.use((0, transform_middleware_1.default)());
    app.use((0, koa_session_1.default)(config_1.sessionConfig, app));
    app.use((0, koa_mount_1.default)('/public', (0, koa_static_1.default)(path_1.default.resolve(process.cwd(), 'static'))));
    app.use((0, koa_jwt_1.default)({
        secret: config_1.APP.jwtKey,
        getToken: (ctx) => ctx.headers['x-token'],
    }).unless({ path: config_1.UnlessLogin }));
    (0, routes_1.default)(app);
    app.listen(8080, () => {
        console.log('server start 8080');
    });
});
//# sourceMappingURL=index.js.map