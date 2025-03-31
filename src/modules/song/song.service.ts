import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SingerCategory } from './entities/singerCategory.entity';
import { Repository } from 'typeorm';
import { Avatar } from './entities/avatar.entity';
import { AddSignerDto } from './dto/addSigner.dto';
import { Singer } from './entities/singer.entity';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(SingerCategory)
    private readonly SingerCategoryRepository: Repository<SingerCategory>,
    @InjectRepository(Avatar)
    private readonly AvatarRepository: Repository<Avatar>,
    @InjectRepository(Singer)
    private readonly SingerRepository: Repository<Singer>,
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
    newAvatar.fileName = avatar.fileName;
    return await this.AvatarRepository.createQueryBuilder('avatar')
      .insert()
      .into(Avatar)
      .values(newAvatar)
      .execute();
  }

  /**
   * 根据歌手分类id查询信息
   */
  async queryCategoryInfo(id: number) {
    return await this.SingerCategoryRepository.createQueryBuilder(
      'singerCategory',
    )
      .where('id = :id', {
        id,
      })
      .getOne();
  }

  /**
   * 根据封面id查询头像信息
   */
  async queryAvatarInfo(id: number) {
    return await this.AvatarRepository.createQueryBuilder('avatar')
      .where('avatar.id = :id', { id })
      .getOne();
  }

  /**
   * 添加歌手
   */
  async addSinger(addSignerDto: AddSignerDto) {
    const categoryInfo = await this.queryCategoryInfo(addSignerDto.categoryId);
    if (!categoryInfo) {
      throw new HttpException('不存在该分类', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const avatar = await this.queryAvatarInfo(addSignerDto.avatarId);
    if (!avatar) {
      throw new HttpException('该头像不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const singer = new Singer();
    singer.singerName = addSignerDto.singerName;
    singer.category = categoryInfo;
    singer.avatar = avatar;
    singer.description = addSignerDto.description;
    const result = await this.SingerRepository.createQueryBuilder('singer')
      .insert()
      .values(singer)
      .execute();
    return {
      id: result.raw.insertId,
    };
  }

  /**
   * 根据id查询歌手信息
   */
  async querySingerInfoById(id: number) {
    return await this.SingerRepository.createQueryBuilder('singer')
      .leftJoinAndSelect('singer.avatar', 'avatar')
      .leftJoinAndSelect('singer.category', 'category')
      .where('singer.id = :id', { id })
      .getOne();
  }

  /**
   * 查询所有歌手
   */
  async queryAllSingers(pageNum = 1, pageSize = 10) {
    const skip = (pageNum - 1) * pageSize;
    const count =
      await this.SingerRepository.createQueryBuilder('singer').getCount();
    const result = await this.SingerRepository.createQueryBuilder('singer')
      .skip(skip)
      .take(pageSize)
      .getMany();
    return {
      data: result,
      total: count,
    };
  }
}
