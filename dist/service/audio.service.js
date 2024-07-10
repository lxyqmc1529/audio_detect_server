"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bootstrap_1 = require("../lib/bootstrap");
const audio_model_1 = require("../models/audio.model");
class AudioService {
    audioRepo = bootstrap_1.AppDataSource.getRepository(audio_model_1.Audio);
    save(audio) {
        return this.audioRepo.save(audio);
    }
    inserts(audios) {
        return this.audioRepo.save(audios);
    }
    async getAll(page, limit) {
        const [data, total] = await this.audioRepo.findAndCount({
            order: {
                updatedAt: 'DESC'
            },
            skip: (page - 1) * limit,
            take: limit
        });
        return {
            data,
            total,
            page
        };
    }
    findById(id) {
        return this.audioRepo.findOne({
            where: { id }
        });
    }
    findByIds(ids) {
        return this.audioRepo.createQueryBuilder('audio')
            .where('audio.id IN (:...ids)', { ids })
            .getMany();
    }
    findByHash(hash) {
        return this.audioRepo.findOne({
            where: { hash }
        });
    }
}
exports.default = new AudioService();
//# sourceMappingURL=audio.service.js.map