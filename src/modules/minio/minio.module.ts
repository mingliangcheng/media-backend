import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import * as minio from 'minio';
import { ConfigService } from '@nestjs/config';
import { ShareService } from '../../share/share.service';

@Module({
  controllers: [],
  providers: [
    MinioService,
    {
      provide: 'MINIO_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new minio.Client({
          endPoint: configService.get<string>('MINIO_END_POINT') as string,
          accessKey: configService.get<string>('MINIO_ACCESS_KEY'),
          secretKey: configService.get<string>('MINIO_SECRET_KEY'),
          port: configService.get<number>('MINIO_PORT'),
          useSSL: configService.get<string>('MINIO_USESSL') !== 'false',
        });
      },
      inject: [ConfigService],
    },
    ShareService,
  ],
  exports: [MinioService],
})
export class MinioModule {}
