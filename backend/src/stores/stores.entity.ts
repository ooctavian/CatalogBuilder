import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../users/users.entity';
import { Exclude } from 'class-transformer';
import { Item } from '../items/items.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    unique: false,
  })
  name: string;

  @Column()
  description: string;

  @Column({
    nullable: true,
    unique: false,
  })
  coverUrl: string;

  @ManyToOne(() => User, (user) => user.stores)
  @JoinColumn()
  @Exclude()
  user: User;

  @OneToMany(() => Item, (item) => item.store, {
    cascade: true,
  })
  @JoinColumn()
  items: Item[];
}
