import { TestingModule } from '@nestjs/testing';
import { ZombieRepository } from '../zombie.repository';
import { createTestingModule } from '../../shared/util/testing.util';
import { createZombie } from '../zombie-testing.util';
import * as faker from 'faker';
import { NotFoundException } from '@nestjs/common';
import { UpdateZombieCommandHandler } from './update-zombie.command';

describe('UpdateZombieCommand', () => {
  let handler: UpdateZombieCommandHandler;
  let zombieRepository: ZombieRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await createTestingModule([UpdateZombieCommandHandler]);
    handler = module.get<UpdateZombieCommandHandler>(
      UpdateZombieCommandHandler,
    );
    zombieRepository = module.get<ZombieRepository>(ZombieRepository);
  });

  afterEach(async () => {
    await module.close();
  });

  it('updates Zombie', async () => {
    // Arrange
    let zombieBefore = createZombie();
    zombieBefore = zombieRepository.create(zombieBefore);
    await zombieRepository.save(zombieBefore);

    const dto = {
      name: `${zombieBefore.name}-updated`,
    };

    // Act
    await handler.execute({ id: zombieBefore.id, dto });

    // Assert
    const zombieAfter = await zombieRepository.findOne({ id: zombieBefore.id });
    expect(zombieAfter.name).not.toBe(zombieBefore.name);
    expect(zombieAfter.name).toBe(dto.name);
  });

  it('does not update other Zombie', async () => {
    // Arrange
    let zombieToUpdate = createZombie();
    let otherZombie = createZombie();
    [zombieToUpdate, otherZombie] = zombieRepository.create([
      zombieToUpdate,
      otherZombie,
    ]);
    await zombieRepository.save([zombieToUpdate, otherZombie]);

    const dto = {
      name: faker.name.firstName(),
    };

    // Act
    await handler.execute({ id: zombieToUpdate.id, dto });

    // Assert
    const otherZombieAfter = await zombieRepository.findOne({
      id: otherZombie.id,
    });
    expect(otherZombieAfter.name).not.toBe(dto.name);
    expect(otherZombieAfter.name).toBe(otherZombie.name);
  });

  it('throws NotFoundException if Zombie does not exist', async () => {
    // Arrange
    const id = faker.datatype.number();

    // Act
    await expect(
      handler.execute({ id, dto: { name: faker.name.firstName() } }),
    ).rejects.toThrow(NotFoundException);
  });
});
