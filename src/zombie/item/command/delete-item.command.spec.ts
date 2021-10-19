import { ZombieRepository } from '../../zombie.repository';
import { TestingModule } from '@nestjs/testing';
import { createTestingModule } from '../../../shared/util/testing.util';
import * as faker from 'faker';
import { ItemRepository } from '../item.repository';
import { createZombie } from '../../zombie-testing.util';
import { DeleteItemCommandHandler } from './delete-item.command';
import { NotFoundException } from '@nestjs/common';

describe('AddItemCommand', () => {
  let handler: DeleteItemCommandHandler;
  let zombieRepository: ZombieRepository;
  let itemRepository: ItemRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await createTestingModule([DeleteItemCommandHandler]);
    handler = module.get<DeleteItemCommandHandler>(DeleteItemCommandHandler);
    zombieRepository = module.get<ZombieRepository>(ZombieRepository);
    itemRepository = module.get<ItemRepository>(ItemRepository);
  });

  afterEach(async () => {
    await module.close();
  });

  it('deletes Item', async () => {
    // Arrange
    const zombie = zombieRepository.create(createZombie());
    await zombieRepository.save(zombie);

    const item = itemRepository.create({
      zombieId: zombie.id,
      externalId: faker.datatype.number(),
    });

    await itemRepository.save(item);

    // Act
    await handler.execute({
      zombieId: zombie.id,
      itemId: item.externalId,
    });

    // Assert
    const zombieAfter = await zombieRepository.findOne({
      relations: ['items'],
      where: { id: zombie.id },
    });

    expect(zombieAfter.items.length).not.toBe(1);
    expect(zombieAfter.items.length).toBe(0);
  });

  it('does not delete other Items', async () => {
    // Arrange
    const zombie = zombieRepository.create(createZombie());
    await zombieRepository.save(zombie);

    const itemToDelete = itemRepository.create({
      zombieId: zombie.id,
      externalId: faker.datatype.number(),
    });

    const otherItem = itemRepository.create({
      zombieId: zombie.id,
      externalId: faker.datatype.number(),
    });

    await itemRepository.save([itemToDelete, otherItem]);

    // Act
    await handler.execute({
      zombieId: zombie.id,
      itemId: itemToDelete.externalId,
    });

    // Assert
    const zombieAfter = await zombieRepository.findOne({
      relations: ['items'],
      where: { id: zombie.id },
    });

    expect(zombieAfter.items.length).not.toBe(2);
    expect(zombieAfter.items.length).toBe(1);
  });

  it('throws NotFoundException if Item does not exist', async () => {
    // Arrange
    const zombie = zombieRepository.create(createZombie());
    await zombieRepository.save(zombie);

    // Act
    await expect(
      handler.execute({ zombieId: zombie.id, itemId: faker.datatype.number() }),
    ).rejects.toThrow(NotFoundException);
  });
});
