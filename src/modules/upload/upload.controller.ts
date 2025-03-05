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

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(
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
    @Body() formDto: any,
  ) {
    Log.error(formDto);
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
