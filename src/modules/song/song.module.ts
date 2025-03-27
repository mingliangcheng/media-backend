import { Module } from '@nestjs/common';
import { SongService } from './song.service';
import { SongController } from './song.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { Singer } from './entities/singer.entity';
import { Collect } from './entities/collect.entity';
import { History } from './entities/history.entity';
import { SingerCategory } from './entities/singerCategory.entity';
import { Avatar } from './entities/avatar.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Song,
      Singer,
      Collect,
      History,
      SingerCategory,
      Avatar,
    ]),
  ],
  controllers: [SongController],
  providers: [SongService],
  exports: [SongService],
})
export class SongModule {}
