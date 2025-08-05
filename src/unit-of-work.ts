import { IUserRepository } from './interfaces/user.repository.interface';
import { UserRepository } from './repositories/user.repository';

export class UnitOfWork {
  public userRepository: IUserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }
}
