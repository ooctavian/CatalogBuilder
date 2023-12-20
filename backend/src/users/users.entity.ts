import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Token } from '../auth/token.entity';
import { Store } from '../stores/stores.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;
  @Column({
    unique: true,
  })
  email: string;
  @Column()
  password: string;
  @OneToMany(() => Token, (token) => token.user)
  @JoinColumn()
  tokens: Token[];

  @OneToMany(() => Store, (store) => store.user, {
    cascade: true,
  })
  @JoinColumn()
  stores: Store[];
}
