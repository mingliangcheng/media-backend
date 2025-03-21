import { Module } from '@nestjs/common';
import { ShareModule } from './share/share.module';
import { UserModule } from './modules/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TestService } from './task/test.service';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MinioModule } from './modules/minio/minio.module';
import { SongModule } from './modules/song/song.module';

@Module({
  imports: [
    ShareModule,
    UserModule,
    ScheduleModule.forRoot(),
    AuthModule,
    UploadModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
      serveRoot: '/upload',
    }),
    MinioModule,
    SongModule,
  ],
  controllers: [],
  providers: [TestService],
})
export class AppModule {}
