import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { Singer } from './entities/singer.entity';
import { Collect } from './entities/collect.entity';
import { History } from './entities/history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song, Singer, Collect, History])],
  controllers: [SongController],
  providers: [SongService],
})
export class SongModule {}
