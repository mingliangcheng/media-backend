import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SingerCategory } from './entities/singerCategory.entity';
import { Repository } from 'typeorm';
import { Avatar } from './entities/avatar.entity';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(SingerCategory)
    private readonly SingerCategoryRepository: Repository<SingerCategory>,
    @InjectRepository(Avatar)
    private readonly AvatarRepository: Repository<Avatar>,
  ) {}
  /**
   * 添加歌手分类
   */
  async addCategory(categoryName: string) {
    const category = await this.SingerCategoryRepository.createQueryBuilder(
      'singerCategory',
    )
      .where('singerCategory.categoryName = :categoryName', { categoryName })
      .getOne();
    if (category) {
      throw new HttpException('分类已存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const newCategory = new SingerCategory();
    newCategory.categoryName = categoryName;
    await this.SingerCategoryRepository.createQueryBuilder('singerCategory')
      .insert()
      .into(SingerCategory)
      .values([newCategory])
      .execute();
    return null;
  }

  /**
   * 查询音乐分类
   */
  async queryCategoryList() {
    return await this.SingerCategoryRepository.createQueryBuilder(
      'singerCategory',
    )
      .select(['singerCategory.categoryName', 'singerCategory.id'])
      .getMany();
  }

  /**
   * 存储头像文件
   */
  async saveAvatar(avatar: Avatar) {
    const newAvatar = new Avatar();
    newAvatar.avatarUrl = avatar.avatarUrl;
    newAvatar.originName = avatar.originName;
    return await this.AvatarRepository.createQueryBuilder('avatar')
      .insert()
      .into(Avatar)
      .values(newAvatar)
      .execute();
  }
}
