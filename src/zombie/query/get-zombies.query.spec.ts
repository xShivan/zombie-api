import { TestingModule } from '@nestjs/testing';
import { ZombieRepository } from '../zombie.repository';
import { createTestingModule } from '../../shared/util/testing.util';
import { GetZombiesQueryHandler } from './get-zombies.query';
import { createZombie } from '../zombie-testing.util';

describe('CreateZombieCommand', () => {
  let handler: GetZombiesQueryHandler;
  let zombieRepository: ZombieRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await createTestingModule([GetZombiesQueryHandler]);
    handler = module.get<GetZombiesQueryHandler>(GetZombiesQueryHandler);
    zombieRepository = module.get<ZombieRepository>(ZombieRepository);
  });

  afterEach(async () => {
    await module.close();
  });

  it('gets Zombies', async () => {
    // Arrange
    let zombies = [createZombie(), createZombie()];
    zombies = zombieRepository.create(zombies);
    await zombieRepository.save(zombies);

    // Act
    const result = await handler.execute({});

    // Assert
    expect(result.length).toBe(zombies.length);
    result.forEach((resultZombie) => {
      const zombie = zombies.find((z) => z.id === resultZombie.id);

      expect(zombie).toBeTruthy();
      expect(resultZombie.name).toBe(zombie.name);
    });
  });
});
