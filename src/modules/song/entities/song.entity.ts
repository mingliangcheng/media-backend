import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Singer } from './singer.entity';
import { SongFile } from './songFile.entity';

@Entity({ name: 'song', comment: '歌曲表' })
export class Song extends BaseEntity {
  @Column({ comment: '歌曲标题' })
  title: string;

  @Column({ comment: '封面地址', default: '' })
  coverUrl: string;

  @Column({ comment: '时长:s', default: 0 })
  duration: number;

  @Column({ comment: '歌词id', default: 0 })
  lyricId: number;

  @Column({ comment: '文件大小' })
  size: number;

  @ManyToOne(() => Singer, (singer) => singer.songs)
  singer: Singer;

  @OneToOne(() => SongFile, (songFile) => songFile.song)
  @JoinColumn()
  file: SongFile;
}
