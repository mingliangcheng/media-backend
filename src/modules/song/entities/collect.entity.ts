import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';

@Entity({ comment: '用户收藏表' })
export class Collect extends BaseEntity {
  @Column({ comment: '用户id' })
  userId: string;

  @Column({ comment: '歌曲id' })
  songId: string;

  @Column({ comment: '收藏时间' })
  collectTime: string;
}
