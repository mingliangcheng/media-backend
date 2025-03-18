import { Column, Entity, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from 'src/common/base.entity';

@Entity()
export class Profile extends BaseEntity {
  @Column()
  name: string;

  @OneToOne(() => User, (user) => user.profile, {
    createForeignKeyConstraints: true,
  })
  user: User;
}
