import * as faker from 'faker';
import { ZombieEntity } from './zombie.entity';

export function createZombie() {
  const zombie: Partial<ZombieEntity> = {
    name: faker.name.firstName(),
  };

  return zombie;
}
