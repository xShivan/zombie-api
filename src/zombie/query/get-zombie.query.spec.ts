import { TestingModule } from '@nestjs/testing';
import { ZombieRepository } from '../zombie.repository';
import { createTestingModule } from '../../shared/util/testing.util';
import { createZombie } from '../zombie-testing.util';
import { GetZombieQueryHandler } from './get-zombie.query';
import * as faker from 'faker';
import { NotFoundException } from '@nestjs/common';

describe('GetZombieQuery', () => {
  let handler: GetZombieQueryHandler;
  let zombieRepository: ZombieRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await createTestingModule([GetZombieQueryHandler]);
    handler = module.get<GetZombieQueryHandler>(GetZombieQueryHandler);
    zombieRepository = module.get<ZombieRepository>(ZombieRepository);
  });

  afterEach(async () => {
    await module.close();
  });

  it('gets Zombie', async () => {
    // Arrange
    let zombies = [createZombie(), createZombie(), createZombie()];
    zombies = zombieRepository.create(zombies);
    await zombieRepository.save(zombies);

    const expectedZombie = zombies[zombies.length - 1];

    // Act
    const result = await handler.execute({ id: expectedZombie.id });

    // Assert
    expect(result).toBeTruthy();
    expect(result.id).toBe(expectedZombie.id);
    expect(result.name).toBe(expectedZombie.name);
    expect(result.createdAt).toStrictEqual(expectedZombie.createdAt);
  });

  it('throws NotFoundException if Zombie does not exist', async () => {
    // Arrange
    const id = faker.datatype.number();

    // Act
    await expect(handler.execute({ id })).rejects.toThrow(NotFoundException);
  });
});
