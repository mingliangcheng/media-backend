import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { SingerCategory } from './singerCategory.entity';
import { Avatar } from './avatar.entity';
import { Song } from './song.entity';

@Entity({ comment: '歌手表' })
export class Singer extends BaseEntity {
  @Column({ comment: '歌手名' })
  singerName: string;

  @Column({ comment: '简介' })
  description: string;

  @ManyToOne(() => SingerCategory, (singerCategory) => singerCategory.singers)
  @JoinColumn()
  category: SingerCategory;

  @OneToOne(() => Avatar, (avatar) => avatar.singer)
  @JoinColumn()
  avatar: Avatar;

  @OneToMany(() => Song, (song) => song.singer)
  songs: Song[];
}
