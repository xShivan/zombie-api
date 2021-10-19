import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemEntity } from './item/item.entity';

export const MAX_ZOMBIE_ITEMS = 5;

@Entity('zombie')
export class ZombieEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ItemEntity, (item) => item.zombie)
  items: ItemEntity[];
}
