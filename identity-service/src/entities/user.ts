import { Entity, Column } from 'typeorm';
import { AppBaseEntity } from './base';

@Entity({ name: 'users' })
export class User extends AppBaseEntity {
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ name: 'full_name', type: 'varchar' })
  full_name: string;

  @Column({ name: 'role', type: 'varchar', default: 'user' })
  role: 'user' | 'admin';
}
