import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MinioModule } from '../minio/minio.module';
import { ShareModule } from '../../share/share.module';
import { SongService } from '../song/song.service';
import { SongModule } from '../song/song.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from '../song/entities/avatar.entity';
import { SingerCategory } from '../song/entities/singerCategory.entity';
import { Singer } from '../song/entities/singer.entity';

@Module({
  imports: [
    MinioModule,
    ShareModule,
    SongModule,
    TypeOrmModule.forFeature([Avatar, SingerCategory, Singer]),
  ],
  controllers: [UploadController],
  providers: [UploadService, SongService],
})
export class UploadModule {}
