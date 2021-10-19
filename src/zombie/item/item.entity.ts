import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ZombieEntity } from '../zombie.entity';

@Entity('Item')
export class ItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ZombieEntity, (zombie) => zombie.items)
  zombie: ZombieEntity;

  @Column()
  zombieId: number;

  @Column()
  externalId: number;
}
