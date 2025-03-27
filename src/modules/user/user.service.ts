import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePasswordDto } from '../auth/dto/update-password.dto';
import { ShareService } from '../../share/share.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly shareService: ShareService,
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

  /**
   * 修改用户密码
   */
  async updatePassword({ username, newPassword }: UpdatePasswordDto) {
    return await this.userRepository
      .createQueryBuilder('user')
      .update(User)
      .set({ password: this.shareService.md5Encrypt(newPassword) })
      .where('user.username = :username', { username })
      .execute();
  }
}
