import { IsNotEmpty, IsPhoneNumber, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @Matches(
    /^\S*(?=\S{8,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/,
    {
      message: '密码强度不符合要求',
    },
  )
  password: string;

  @IsPhoneNumber('CN')
  telephone: string;
}
