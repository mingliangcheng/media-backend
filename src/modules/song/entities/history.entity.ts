import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';

@Entity({ comment: '播放记录' })
export class History extends BaseEntity {
  @Column({ comment: '用户id' })
  userId: string;

  @Column({ comment: '音乐id' })
  songId: string;

  @Column({ comment: '播放时间' })
  playTime: string;
}
