import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';

@Entity({ name: 'song', comment: '歌曲表' })
export class Song extends BaseEntity {
  @Column({ comment: '歌曲标题' })
  title: string;

  @Column({ comment: '封面地址' })
  coverUrl: string;

  @Column({ comment: '时长:s' })
  duration: number;

  @Column({ comment: '专辑id' })
  albumId: string;

  @Column({ comment: '歌手id' })
  singerId: string;

  @Column({ comment: '歌词id' })
  lyricId: string;

  @Column({ comment: '文件路径' })
  filePath: string;
}
