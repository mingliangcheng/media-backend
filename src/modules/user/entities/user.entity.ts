import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ comment: '用户名', length: 50 })
  username: string;

  @Column({ comment: '密码' })
  password: string;

  @Column({ comment: '手机号', length: 15 })
  telephone: string;

  @Column({ comment: '邮箱', length: 50, nullable: true })
  email: string;

  @Column({ comment: '性别', nullable: true })
  gender: number;

  @Column({ comment: '生日', nullable: true })
  birthday: string;

  @Column({ comment: '头像', nullable: true })
  avatar: string;

  @Column({ comment: '用户等级', default: 1 })
  level: number;

  @Column({ comment: '签名', length: 150, nullable: true })
  signature: string;
}
