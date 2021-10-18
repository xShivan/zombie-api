import { TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { CreateZombieCommandHandler } from './create-zombie.command';
import { ZombieRepository } from '../zombie.repository';
import { createTestingModule } from '../../shared/util/testing.util';

describe('CreateZombieCommand', () => {
  let handler: CreateZombieCommandHandler;
  let zombieRepository: ZombieRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await createTestingModule([CreateZombieCommandHandler]);
    handler = module.get<CreateZombieCommandHandler>(
      CreateZombieCommandHandler,
    );
    zombieRepository = module.get<ZombieRepository>(ZombieRepository);
  });

  afterEach(async () => {
    await module.close();
  });

  it('creates Zombie', async () => {
    // Arrange
    const dto = {
      name: faker.name.firstName(),
    };

    // Act
    const result = await handler.execute({ dto });

    // Assert
    const zombie = await zombieRepository.findOne();

    expect(zombie).toBeTruthy();
    expect(result.value).toBe(zombie.id);
    expect(zombie.name).toBe(dto.name);
    expect(zombie.createdAt).toBeDefined();
  });
});
