"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = exports.AppDataSource = void 0;
const config_1 = require("../config");
const typeorm_1 = require("typeorm");
const models_1 = require("../models");
require("reflect-metadata");
// 初始化数据库
exports.AppDataSource = new typeorm_1.DataSource({
    type: config_1.DB.type,
    host: config_1.DB.host,
    port: config_1.DB.port,
    username: config_1.DB.username,
    password: config_1.DB.password,
    database: config_1.DB.database,
    synchronize: true,
    logging: false,
    entities: [
        models_1.User,
        models_1.Audio,
    ],
});
async function bootstrap() {
    await exports.AppDataSource.initialize();
}
exports.bootstrap = bootstrap;
//# sourceMappingURL=bootstrap.js.map