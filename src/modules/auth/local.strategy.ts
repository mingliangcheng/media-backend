import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
    });
  }
  async validate(name: string, password: string) {
    const user = await this.authService.validateUser(name, password);
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return user;
  }
}
