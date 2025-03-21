import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';

@Entity({ comment: '歌手表' })
export class Singer extends BaseEntity {
  @Column({ comment: '歌手名' })
  singerName: string;

  @Column({ comment: '歌手头像' })
  singerAvatar: string;

  @Column({ comment: '简介' })
  description: string;
}
