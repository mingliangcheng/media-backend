import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../../share/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { ShareService } from '../../share/share.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private configService: ConfigService,
    private shareService: ShareService,
  ) {}
  async login(user: { username: string; id: string }) {
    const payload = { name: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);
    await this.redisService.setKey(
      `${payload.name}&${payload.sub}`,
      token,
      this.configService.get('TOKEN_EXPIRE'),
    );
    return {
      token,
    };
  }

  async validateUser(name: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(name);
    if (user) {
      if (user.password !== this.shareService.md5Encrypt(pass)) {
        throw new HttpException(
          '用户名或密码错误',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        const { password, ...result } = user;
        console.log(password);
        return result;
      }
    }
    return null;
  }
}
