import { AppDataSource } from '@app/lib/bootstrap';
import { Audio } from '@app/models/audio.model';
import { pagination } from 'typeorm-pagination'

class AudioService {
  private audioRepo = AppDataSource.getRepository(Audio);

  save(audio: Partial<Audio>) {
    return this.audioRepo.save(audio);
  }

  inserts(audios: Array<Partial<Audio>>) {
    return this.audioRepo.save(audios);
  }

  async getAll(page: number, limit: number) {
    const [data, total] = await this.audioRepo.findAndCount({
      order: {
        createdAt: 'DESC'
      },
      skip: (page - 1) * limit,
      take: limit
    });
    return {
      data,
      total,
      page
    }
  }

  findById(id: string) {
    return this.audioRepo.findOne({
      where: { id }
    });
  }
  
  findByIds(ids: string[]) {
    return this.audioRepo.createQueryBuilder('audio')
      .where('audio.id IN (:...ids)', { ids })
      .getMany();
  }
  
  findByHash(hash: string) {
    return this.audioRepo.findOne({
      where: { hash }
    });
  }
}

export default new AudioService();