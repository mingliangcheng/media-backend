import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Profile } from './profile.entity';
import { Photo } from './photo.entity';
import { BaseEntity } from 'src/common/base.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  password: string;

  @OneToOne(() => Profile, (profile) => profile.user, {
    createForeignKeyConstraints: true,
  })
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];
}
