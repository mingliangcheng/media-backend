import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import e from 'express';
import { ShareService } from '../../share/share.service';
import * as fs from 'node:fs';
import { ShareModule } from '../../share/share.module';
import { Log } from '../../share/log4js';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (
        configService: ConfigService,
        shareService: ShareService,
      ) => ({
        storage: diskStorage({
          destination: (_, file: Express.Multer.File, callback) => {
            // 定义文件上传格式
            const allowedImageTypes = [
              'gif',
              'png',
              'jpg',
              'jpeg',
              'bmp',
              'webp',
              'svg',
              'tiff',
            ]; // 图片
            const allowedOfficeTypes = [
              'xls',
              'xlsx',
              'doc',
              'docx',
              'ppt',
              'pptx',
              'pdf',
              'txt',
              'md',
              'csv',
            ]; // office
            const allowedVideoTypes = ['mp4', 'avi', 'wmv']; // 视频
            const allowedAudioTypes = ['mp3', 'wav', 'ogg']; // 音频
            // 根据上传的文件类型将图片视频音频和其他类型文件分别存到对应英文文件夹
            const fileExtension = file.originalname
              ? (file.originalname.split('.')?.pop()?.toLowerCase() as string)
              : '';
            let temp = 'other';
            if (allowedImageTypes.includes(fileExtension)) {
              temp = 'image';
            } else if (allowedOfficeTypes.includes(fileExtension)) {
              temp = 'office';
            } else if (allowedVideoTypes.includes(fileExtension)) {
              temp = 'video';
            } else if (allowedAudioTypes.includes(fileExtension)) {
              temp = 'audio';
            }
            const uploadPath = configService.get<string>('UPLOAD_PATH');
            const dateNow = new Date();
            const formatDay = `${dateNow.getFullYear()}-${dateNow.getMonth() + 1 < 9 ? '0' + (dateNow.getMonth() + 1) : dateNow.getMonth() + 1}-${dateNow.getDate() < 10 ? '0' + dateNow.getDate() : dateNow.getDate()}`;
            // 文件以年月命名文件夹
            const filePath = `${uploadPath}/${temp}/${formatDay}`;
            if (!fs.existsSync(filePath)) {
              fs.mkdirSync(filePath, { recursive: true });
            }
            return callback(null, `${filePath}`);
          },
          filename: (
            req: e.Request,
            file: Express.Multer.File,
            callback: (error: Error | null, filename: string) => void,
          ) => {
            Log.error(file.mimetype);
            // 使用随机 uuid 生成文件名
            const filename = `${shareService.generateUUID()}.${file.originalname}`;
            return callback(null, Date.now() + '-' + filename);
          },
        }),
      }),
      inject: [ConfigService, ShareService],
      imports: [ShareModule],
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
