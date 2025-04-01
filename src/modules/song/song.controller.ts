import { Body, Controller, ParseIntPipe, Post } from '@nestjs/common';
import { SongService } from './song.service';
import { AddSingerCategoryDto } from './dto/addSingerCategory.dto';
import { AddSignerDto } from './dto/addSigner.dto';
import { QuerySingerDto } from './dto/querySinger.dto';
import { QuerySongDto } from './dto/querySong.dto';

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

  /**
   * 添加歌手
   */
  @Post('/addSinger')
  async addSigner(
    @Body()
    addSingerDto: AddSignerDto,
  ) {
    return await this.songService.addSinger(addSingerDto);
  }

  /**
   * 根据歌手id查询歌手信息
   */
  @Post('/querySingerInfoById')
  async querySingerInfoById(@Body('id', ParseIntPipe) id: number) {
    return this.songService.querySingerInfo(id);
  }

  /**
   * 查询所有歌手
   */
  @Post('/queryAllSingers')
  async queryAllSingers(
    @Body('pageNum', ParseIntPipe) pageNum: number,
    @Body('pageSize', ParseIntPipe) pageSize: number,
  ) {
    return await this.songService.queryAllSingers(pageNum, pageSize);
  }

  /**
   * 根据分类id查询歌手
   */
  @Post('/querySingersByCategoryId')
  async querySingersByCategoryId(@Body() querySingerDto: QuerySingerDto) {
    return await this.songService.querySingersByCategoryId(querySingerDto);
  }

  /**
   * 根据歌手id查询音乐
   */
  @Post('/querySongsBySingerId')
  async querySongsBySingerId(@Body() querySongDto: QuerySongDto) {
    return await this.songService.querySongsBySingerId(querySongDto);
  }
}
