import { EntityRepository, Repository } from 'typeorm';
import { ZombieEntity } from './zombie.entity';

@EntityRepository(ZombieEntity)
export class ZombieRepository extends Repository<ZombieEntity> {}
