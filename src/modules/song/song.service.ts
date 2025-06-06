import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SingerCategory } from './entities/singerCategory.entity';
import { Repository } from 'typeorm';
import { Avatar } from './entities/avatar.entity';
import { AddSignerDto } from './dto/addSigner.dto';
import { Singer } from './entities/singer.entity';
import { QuerySingerDto } from './dto/querySinger.dto';
import { Song } from './entities/song.entity';
import { SongFile } from './entities/songFile.entity';
import { QuerySongDto } from './dto/querySong.dto';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(SingerCategory)
    private readonly SingerCategoryRepository: Repository<SingerCategory>,
    @InjectRepository(Avatar)
    private readonly AvatarRepository: Repository<Avatar>,
    @InjectRepository(Singer)
    private readonly SingerRepository: Repository<Singer>,
    @InjectRepository(SongFile)
    private readonly SongFileRepository: Repository<SongFile>,
    @InjectRepository(Song)
    private readonly SongRepository: Repository<Song>,
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
      .where('singerCategory.id = :id', {
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
      throw new HttpException('分类不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const avatar = await this.queryAvatarInfo(addSignerDto.avatarId);
    if (!avatar) {
      throw new HttpException('头像不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const singerInfo = await this.querySingerInfo(0, addSignerDto.singerName);
    if (singerInfo) {
      throw new HttpException('歌手已存在', HttpStatus.INTERNAL_SERVER_ERROR);
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
  async querySingerInfo(id?: number, name?: string) {
    const singerQueryBuilder =
      this.SingerRepository.createQueryBuilder('singer');
    if (id) {
      singerQueryBuilder.andWhere('singer.id = :id', { id });
    }
    if (name) {
      singerQueryBuilder.andWhere('singer.singerName = :name', { name });
    }
    return await singerQueryBuilder
      .leftJoinAndSelect('singer.avatar', 'avatar')
      .leftJoinAndSelect('singer.category', 'category')
      .getOne();
  }

  /**
   * 查询所有歌手
   */
  async queryAllSingers(pageNum = 1, pageSize = 10) {
    const skip = (pageNum - 1) * pageSize;
    const [result, count] = await this.SingerRepository.createQueryBuilder(
      'singer',
    )
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();
    return {
      list: result,
      total: count,
    };
  }

  /**
   * 根据分类id查询歌手信息
   */
  async querySingersByCategoryId(querySingerDto: QuerySingerDto) {
    const singerCreateQueryBuilder = this.SingerRepository.createQueryBuilder(
      'singer',
    )
      .leftJoinAndSelect('singer.category', 'category')
      .leftJoinAndSelect('singer.avatar', 'avatar')
      .select(['avatar', 'singer.singerName', 'singer.id', 'category.id'])
      .where('category.id = :id', { id: querySingerDto.categoryId });
    if (querySingerDto.pageNum && querySingerDto.pageSize) {
      const skip = (querySingerDto.pageNum - 1) * querySingerDto.pageSize;
      singerCreateQueryBuilder.skip(skip).take(querySingerDto.pageSize);
    }

    const [result, total] = await singerCreateQueryBuilder.getManyAndCount();
    return {
      list: result,
      total: total,
    };
  }

  /**
   * 保存音乐文件
   */
  async insertSongFile(songFile: SongFile) {
    await this.SongFileRepository.createQueryBuilder('songFile')
      .insert()
      .into(SongFile)
      .values(songFile)
      .execute();
  }

  /**
   * 导入音乐
   */
  async insertSong(song: Song) {
    return await this.SongRepository.createQueryBuilder('song')
      .insert()
      .into(Song)
      .values([song])
      .execute();
  }

  /**
   * 根据歌手id查询音乐列表
   */
  async querySongsBySingerId(querySongDto: QuerySongDto) {
    const singer = await this.querySingerInfo(querySongDto.singerId);
    if (!singer) {
      throw new HttpException('歌手不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const songQueryBuilder = this.SongRepository.createQueryBuilder('song');
    if (querySongDto.pageNum && querySongDto.pageSize) {
      const skip = (querySongDto.pageNum - 1) * querySongDto.pageSize;
      songQueryBuilder.skip(skip).take(querySongDto.pageSize);
    }
    const [result, count] = await songQueryBuilder
      .leftJoinAndSelect('song.singer', 'singer', 'singer.id = :id', {
        id: querySongDto.singerId,
      })
      .leftJoinAndSelect('song.file', 'file')
      .select([
        'song.id',
        'song.title',
        'singer.id',
        'singer.singerName',
        'file.fileUrl',
        'file.id',
      ])
      .getManyAndCount();
    return {
      list: result,
      total: count,
    };
  }
}
