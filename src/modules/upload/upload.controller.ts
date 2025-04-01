import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MinioService } from '../minio/minio.service';
import { ShareService } from '../../share/share.service';
import { SongService } from '../song/song.service';
import { Avatar } from '../song/entities/avatar.entity';
import { formatDay } from '../../utils/date';
import { ConfigService } from '@nestjs/config';
import { AddSongDto } from '../song/dto/addSong.dto';
import { SongFile } from '../song/entities/songFile.entity';
import { Song } from '../song/entities/song.entity';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly minioService: MinioService,
    private readonly shareService: ShareService,
    private readonly songService: SongService,
    private readonly configService: ConfigService,
  ) {}

  /**
   *上传歌手头像
   */
  @Post('/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024,
          message: (maxSize) => `文件大小超过${maxSize / 1024 / 1024}Mb`,
        })
        .build({
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
          fileIsRequired: true,
        }),
    )
    file: Express.Multer.File,
  ) {
    const filename = `${formatDay()}/${Date.now()}-${this.shareService.generateUUID()}.${file.originalname}`;
    const data = await this.minioService.uploadFile(
      this.configService.get<string>('MINIO_BUCKET_NAME') as string,
      file,
    );
    const avatar = new Avatar();
    avatar.avatarUrl = data.url;
    avatar.originName = file.originalname;
    avatar.fileName = filename;
    const result = await this.songService.saveAvatar(avatar);
    return {
      url: data.url,
      id: result.raw.insertId,
    };
  }

  @Post('/batchUploadMusic')
  @UseInterceptors(FilesInterceptor('files', 20))
  async uploadMultipleFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() addSongDto: AddSongDto,
  ) {
    const singer = await this.songService.querySingerInfo(addSongDto.singerId);
    if (!singer) {
      throw new HttpException('歌手不存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    for (const file of files) {
      const data = await this.minioService.uploadFile(
        this.configService.get('MINIO_BUCKET_NAME') as string,
        file,
      );
      const filename = `${formatDay()}/${Date.now()}-${this.shareService.generateUUID()}.${file.originalname}`;
      const songFile = new SongFile();
      songFile.fileName = filename;
      songFile.fileUrl = data.url;
      songFile.originName = file.originalname;
      await this.songService.insertSongFile(songFile);

      const song = new Song();
      song.size = file.size;
      song.title = file.originalname;
      song.file = songFile;
      song.singer = singer;
      await this.songService.insertSong(song);
    }
    return null;
  }
}
