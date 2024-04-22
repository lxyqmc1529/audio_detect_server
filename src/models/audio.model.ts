import { Entity, Column } from 'typeorm';
import { BaseModel } from './base.model';

export enum AudioStatus {
  wait = 'wait',
  success = 'success',
  fail = 'fail',
}

@Entity()
export class Audio extends BaseModel {
  @Column()
  filename: string;
  // 音频文件存储路径
  @Column({ nullable: false })
  fileKey: string;

  @Column({ type: 'text', nullable: true })
  result: string;

  @Column({ type: 'enum', enum: [AudioStatus.wait, AudioStatus.success, AudioStatus.fail], default: AudioStatus.wait })
  status: AudioStatus;

  @Column({ unique: true })
  hash: string;
}