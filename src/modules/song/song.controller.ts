import { Body, Controller, Post } from '@nestjs/common';
import { SongService } from './song.service';
import { AddSingerCategoryDto } from './dto/addSingerCategory.dto';

@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  /**
   * 添加音乐分类
   */
  @Post('/addSingerCategory')
  async addSingerCategory(@Body() addSingerCategoryDto: AddSingerCategoryDto) {
    return await this.songService.addCategory(
      addSingerCategoryDto.categoryName,
    );
  }

  /**
   * 查询音乐分类
   */
  @Post('/queryCategoryList')
  async queryCategoryList() {
    return await this.songService.queryCategoryList();
  }
}
