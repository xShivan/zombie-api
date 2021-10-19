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
  public id: number;

  @Column()
  public name: string;

  @CreateDateColumn()
  public createdAt: Date;

  @OneToMany(() => ItemEntity, (item) => item.zombie)
  public items: ItemEntity[];
}
