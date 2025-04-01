import { IsNotEmpty } from 'class-validator';

export class QuerySongDto {
  @IsNotEmpty()
  singerId: number;

  pageNum?: number;

  pageSize?: number;
}
