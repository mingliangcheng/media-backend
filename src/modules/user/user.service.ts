import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // 根据手机号查询用户
  async findUserByTelephone(phone: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.telephone = :telephone', {
        telephone: phone,
      })
      .getOne();
  }

  // 根据用户名查询用户
  async findUserByUsername(username: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', {
        username,
      })
      .getOne();
  }

  // 创建用户
  async createUser(user: User) {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .insert()
      .into(User)
      .values([user])
      .execute();
    return result.raw.insertId;
  }

  async findOne(username: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();
  }
}
