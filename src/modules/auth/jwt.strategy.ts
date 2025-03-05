import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../share/redis/redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private redisService: RedisService,
  ) {
    // @ts-ignore
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }
  async validate(req: any, payload: any) {
    //2.从请求头中获取token
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const cacheToken = await this.redisService.getKey(
      `${payload.name}&${payload.sub}`,
    );
    if (!cacheToken) {
      throw new UnauthorizedException('token 已过期');
    }
    //3.不同的话，则在其他地方登录
    if (token !== cacheToken) {
      throw new UnauthorizedException();
    }

    // token有效期内，重新设置token时间
    await this.redisService.setKey(
      `${payload.name}&${payload.sub}`,
      token as string,
      this.configService.get('TOKEN_EXPIRE'),
    );
    return payload;
  }
}
