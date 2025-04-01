import { IsNotEmpty } from 'class-validator';

export class AddSongDto {
  coverUrl: string;

  duration: number;

  size: number;

  @IsNotEmpty()
  singerId: number;
}
