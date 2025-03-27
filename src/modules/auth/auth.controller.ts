import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../decorator/auth.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { ShareService } from '../../share/share.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly shareService: ShareService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  /**
   * 用户注册，用户名，密码注册
   */
  @Post('/register')
  @Public()
  async register(@Body() registerUserDto: RegisterUserDto) {
    // 1.根据手机号，是否存在用户
    const user = await this.userService.findUserByTelephone(
      registerUserDto.telephone,
    );
    if (user) {
      throw new HttpException('手机号已存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 2.根据用户名查询用户
    const user1 = await this.userService.findUserByUsername(
      registerUserDto.username,
    );
    if (user1) {
      throw new HttpException('用户名已存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 2.加密password，存入数据库
    const newUser = new User();
    newUser.telephone = registerUserDto.telephone;
    newUser.username = registerUserDto.username;
    newUser.password = this.shareService.md5Encrypt(registerUserDto.password);
    return await this.userService.createUser(newUser);
  }

  /**
   * 用户注册，手机号验证码登录，直接注册
   */

  /**
   * 修改密码
   */
  @Post('/modifyPassword')
  async modifyPassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userService.findOne(updatePasswordDto.username);
    if (!user) {
      throw new HttpException('用户名不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (
      this.shareService.md5Encrypt(updatePasswordDto.oldPassword) !==
      user.password
    ) {
      throw new HttpException('旧密码不正确', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (updatePasswordDto.newPassword === updatePasswordDto.oldPassword) {
      throw new HttpException(
        '新密码与旧密码相同',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const result = await this.userService.updatePassword(updatePasswordDto);
    if (result.affected) {
      return null;
    } else {
      throw new HttpException('修改失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
