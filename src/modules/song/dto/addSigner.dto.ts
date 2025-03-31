import { IsNotEmpty } from 'class-validator';

export class AddSignerDto {
  @IsNotEmpty()
  singerName: string;

  description: string;

  @IsNotEmpty()
  avatarId: number;

  @IsNotEmpty()
  categoryId: number;
}
