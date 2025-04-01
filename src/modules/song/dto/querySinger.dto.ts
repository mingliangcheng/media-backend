import { IsNotEmpty } from 'class-validator';

export class QuerySingerDto {
  @IsNotEmpty()
  categoryId: number;

  pageNum?: number;

  pageSize?: number;
}
