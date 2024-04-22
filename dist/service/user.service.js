"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bootstrap_1 = require("../lib/bootstrap");
const user_model_1 = require("../models/user.model");
class UserService {
    userRepo = bootstrap_1.AppDataSource.getRepository(user_model_1.User);
    findByName(name) {
        return this.userRepo.findOne({
            where: { username: name }
        });
    }
    findById(id) {
        return this.userRepo.findOne({
            where: { id }
        });
    }
    save(user) {
        return this.userRepo.save(user);
    }
}
exports.default = new UserService();
//# sourceMappingURL=user.service.js.map