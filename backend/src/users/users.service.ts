import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrpyt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async save(user: User): Promise<User> {
    user.password = await bcrpyt.hash(user.password, 10);
    return await this.userRepository.save(user);
  }

  async validate(email: string, password: string): Promise<User | null> {
    if (!email || !password) {
      return null;
    }
    const foundUser = await this.userRepository.findOneBy({
      email,
    });
    if (
      foundUser == null ||
      !(await bcrpyt.compare(password, foundUser.password))
    ) {
      return null;
    }
    return foundUser;
  }
}
