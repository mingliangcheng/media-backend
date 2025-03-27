import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Singer } from './singer.entity';

@Entity({ comment: '歌手分类表' })
export class SingerCategory extends BaseEntity {
  @Column({ comment: '歌手分类名称' })
  categoryName: string;

  @OneToMany(() => Singer, (singer) => singer.category)
  singers: Singer[];
}
