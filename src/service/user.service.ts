import { AppDataSource } from '@app/lib/bootstrap';
import { User } from '@app/models/user.model';

class UserService {
  private userRepo = AppDataSource.getRepository(User);
  
  findByName(name: string) {
    return this.userRepo.findOne({
      where: { username: name }
    })
  }

  findById(id: string) {
    return this.userRepo.findOne({
      where: { id }
    });
  }

  save(user: Partial<User>) {
    return this.userRepo.save(user);
  }
}

export default new UserService();