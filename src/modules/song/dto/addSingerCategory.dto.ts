import { IsNotEmpty } from 'class-validator';

export class AddSingerCategoryDto {
  @IsNotEmpty()
  categoryName: string;
}
