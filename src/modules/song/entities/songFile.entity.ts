import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Song } from './song.entity';

@Entity()
export class SongFile extends BaseEntity {
  @Column({ comment: '文件路径', type: 'text' })
  fileUrl: string;

  @Column({ comment: '原始名称' })
  originName: string;

  @Column({ comment: 'minio中文件名称', type: 'text' })
  fileName: string;

  @OneToOne(() => Song, (song) => song.file)
  song: Song;
}
