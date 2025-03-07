import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MinioModule } from '../minio/minio.module';
import { ShareModule } from '../../share/share.module';

@Module({
  imports: [MinioModule, ShareModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
