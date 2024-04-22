import { Entity, Column } from 'typeorm';
import { BaseModel } from './base.model';

const enum UserRole {
  admin = 'admin',
  user = 'user'
}

@Entity()
export class User extends BaseModel {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: [UserRole.admin, UserRole.user], default: UserRole.user  })
  role: UserRole;

  @Column({ default: false })
  actived: boolean;
}