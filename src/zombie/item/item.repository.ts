import { ItemEntity } from './item.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ItemEntity)
export class ItemRepository extends Repository<ItemEntity> {}
