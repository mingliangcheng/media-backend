import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @UpdateDateColumn()
  updateTime: Date;

  @CreateDateColumn()
  createTime: Date;

  @DeleteDateColumn()
  deleteTime: Date;

  @VersionColumn({ comment: '版本' })
  version: number;

  @Column({ comment: '删除，0未删除 1已删除', default: 0 })
  isDeleted: number;
}
