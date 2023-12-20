import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Store } from '../stores/stores.entity';
@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('integer')
  price: number;

  @Column('json', { nullable: true, default: '[]' })
  imageUrls?: string[];

  @Column({ nullable: true })
  url?: string;

  @ManyToOne(() => Store, (store) => store.items, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn()
  @Exclude()
  store: Store;
}
