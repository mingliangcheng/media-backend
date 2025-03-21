import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../../share/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { ShareService } from '../../share/share.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private configService: ConfigService,
    private shareService: ShareService,
  ) {}
  async login(user: any) {
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
    if (user && user.password === this.shareService.md5Encrypt(pass)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
