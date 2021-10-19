import { TestingModule } from '@nestjs/testing';
import { ZombieRepository } from '../zombie.repository';
import { createTestingModule } from '../../shared/util/testing.util';
import { createZombie } from '../zombie-testing.util';
import * as faker from 'faker';
import { NotFoundException } from '@nestjs/common';
import { DeleteZombieCommandHandler } from './delete-zombie.command';

describe('DeleteZombieCommand', () => {
  let handler: DeleteZombieCommandHandler;
  let zombieRepository: ZombieRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await createTestingModule([DeleteZombieCommandHandler]);
    handler = module.get<DeleteZombieCommandHandler>(
      DeleteZombieCommandHandler,
    );
    zombieRepository = module.get<ZombieRepository>(ZombieRepository);
  });

  afterEach(async () => {
    await module.close();
  });

  it('deletes Zombie', async () => {
    // Arrange
    let zombie = createZombie();
    zombie = zombieRepository.create(zombie);
    await zombieRepository.save(zombie);

    // Act
    await handler.execute({ id: zombie.id });

    // Assert
    const zombieAfter = await zombieRepository.findOne({ id: zombie.id });
    expect(zombieAfter).toBeUndefined();
  });

  it('does not delete other Zombie', async () => {
    // Arrange
    let zombieToDelete = createZombie();
    let otherZombie = createZombie();
    [zombieToDelete, otherZombie] = zombieRepository.create([
      zombieToDelete,
      otherZombie,
    ]);
    await zombieRepository.save([zombieToDelete, otherZombie]);

    // Act
    await handler.execute({ id: zombieToDelete.id });

    // Assert
    const otherZombieAfter = await zombieRepository.findOne({
      id: otherZombie.id,
    });

    expect(otherZombieAfter).toBeTruthy();
  });

  it('throws NotFoundException if Zombie does not exist', async () => {
    // Arrange
    const id = faker.datatype.number();

    // Act
    await expect(handler.execute({ id })).rejects.toThrow(NotFoundException);
  });
});
