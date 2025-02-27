import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreatePhotoDto {
  @IsNotEmpty()
  @IsEmail()
  name: string;
}
