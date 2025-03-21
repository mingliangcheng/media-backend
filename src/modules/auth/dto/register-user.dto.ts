import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsPhoneNumber('CN')
  telephone: string;
}
