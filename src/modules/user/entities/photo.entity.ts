import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from 'src/common/base.entity';

@Entity()
export class Photo extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;
}
