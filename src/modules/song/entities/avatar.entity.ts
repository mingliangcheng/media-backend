import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Singer } from './singer.entity';

@Entity()
export class Avatar extends BaseEntity {
  @Column({ comment: '地址', type: 'text' })
  avatarUrl: string;

  @Column({ comment: '原始文件名称' })
  originName: string;

  @Column({ comment: 'minio中文件名称', type: 'text' })
  fileName: string;

  @OneToOne(() => Singer, (singer) => singer.avatar)
  singer: Singer;
}
