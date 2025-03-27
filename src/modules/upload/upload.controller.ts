import {
  Body,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { Log } from '../../share/log4js';
import { MinioService } from '../minio/minio.service';
import { ShareService } from '../../share/share.service';
import { SongService } from '../song/song.service';
import { Avatar } from '../song/entities/avatar.entity';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly minioService: MinioService,
    private readonly shareService: ShareService,
    private readonly songService: SongService,
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
    const dateNow = new Date();
    const formatDay = `${dateNow.getFullYear()}-${dateNow.getMonth() + 1 < 9 ? '0' + (dateNow.getMonth() + 1) : dateNow.getMonth() + 1}-${dateNow.getDate() < 10 ? '0' + dateNow.getDate() : dateNow.getDate()}`;
    const filename = `${formatDay}/${Date.now()}-${this.shareService.generateUUID()}.${file.originalname}`;
    const data = await this.minioService.uploadFile(
      'test',
      filename,
      file,
      file.size,
      file.mimetype,
    );
    const avatar = new Avatar();
    avatar.avatarUrl = data.url;
    avatar.originName = file.originalname;
    const result = await this.songService.saveAvatar(avatar);
    return {
      url: data.url,
      id: result.raw.insertId,
    };
  }

  @Post('/multipleUploads')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'file',
        maxCount: 1,
      },
      {
        name: 'avatar',
        maxCount: 2,
      },
    ]),
  )
  uploadMultipleFile(
    @UploadedFiles()
    files: {
      file: Express.Multer.File[];
      avatar: Express.Multer.File[];
    },
    @Body() formDto: any,
  ) {
    Log.error(files);
    Log.error(formDto);
  }
}
