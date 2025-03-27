import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RedisService } from '../../share/redis/redis.service';
import { validateTelephone } from '../../utils/validate';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 根据手机号查询用户
   */
  @Post('/findUserByPhone')
  findUserByPhone(@Body('telephone') telephone: string) {
    if (!telephone) {
      throw new BadRequestException('手机号不能为空');
    }
    if (!validateTelephone(telephone)) {
      throw new BadRequestException('手机号格式不正确');
    }
    // 查询用户
    return this.userService.findUserByTelephone(telephone);
  }
}
