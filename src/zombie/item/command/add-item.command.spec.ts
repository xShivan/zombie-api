import { AddItemCommandHandler } from './add-item.command';
import { ZombieRepository } from '../../zombie.repository';
import { TestingModule } from '@nestjs/testing';
import { createTestingModule } from '../../../shared/util/testing.util';
import * as faker from 'faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ItemService } from '../item.service';
import { ApiItemDto } from '../dto/api-item.dto';
import { createZombie } from '../../zombie-testing.util';
import { MAX_ZOMBIE_ITEMS, ZombieEntity } from '../../zombie.entity';
import { ItemRepository } from '../item.repository';

const mockApiItems: ApiItemDto[] = [
  {
    id: faker.datatype.number(),
    name: faker.lorem.word(),
    price: faker.commerce.price(),
  },
  {
    id: faker.datatype.number(),
    name: faker.lorem.word(),
    price: faker.commerce.price(),
  },
];

class ItemServiceMock {
  getItems(): Promise<ApiItemDto[]> {
    return Promise.resolve(mockApiItems);
  }
}

describe('AddItemCommand', () => {
  let handler: AddItemCommandHandler;
  let zombieRepository: ZombieRepository;
  let itemRepository: ItemRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await createTestingModule([
      AddItemCommandHandler,
      { provide: ItemService, useClass: ItemServiceMock },
    ]);
    handler = module.get<AddItemCommandHandler>(AddItemCommandHandler);
    zombieRepository = module.get<ZombieRepository>(ZombieRepository);
    itemRepository = module.get<ItemRepository>(ItemRepository);
  });

  afterEach(async () => {
    await module.close();
  });

  it('adds Item to Zombie', async () => {
    // Arrange
    const zombie = zombieRepository.create(createZombie());
    await zombieRepository.save(zombie);

    const apiItem = mockApiItems[0];

    // Act
    await handler.execute({ zombieId: zombie.id, itemId: apiItem.id });

    // Assert
    const zombieAfter = await zombieRepository.findOne({
      relations: ['items'],
      where: { id: zombie.id },
    });

    expect(zombieAfter.items.length).toBe(1);
    expect(zombieAfter.items[0].externalId).toBe(apiItem.id);
  });

  it('throws BadRequestException if Zombie already has an Item with specified ID', async () => {
    // Arrange
    const zombie = zombieRepository.create(createZombie());
    await zombieRepository.save(zombie);

    const apiItem = mockApiItems[0];

    const item = itemRepository.create({
      zombieId: zombie.id,
      externalId: apiItem.id,
    });

    await itemRepository.save(item);

    // Act
    const promise = handler.execute({
      zombieId: zombie.id,
      itemId: apiItem.id,
    });

    // Assert
    await expect(promise).rejects.toThrow(BadRequestException);
    await expect(promise).rejects.toThrow(
      `Zombie already has an item with ID ${apiItem.id}`,
    );

    const zombieAfter = await zombieRepository.findOne({
      relations: ['items'],
      where: { id: zombie.id },
    });

    expect(zombieAfter.items.length).not.toBe(2);
    expect(zombieAfter.items.length).toBe(1);
  });

  describe('throws BadRequestException if Zombie has', () => {
    const testCounts = [MAX_ZOMBIE_ITEMS, MAX_ZOMBIE_ITEMS + 1];

    testCounts.forEach((itemsCount) => {
      it(`${itemsCount} items`, async () => {
        // Arrange
        const zombie = zombieRepository.create(createZombie());
        await zombieRepository.save(zombie);

        let items: Partial<ZombieEntity>[] = Array.from(
          { length: itemsCount },
          (_, i) => ({
            id: i,
            name: faker.lorem.word(),
            createdAt: new Date(),
            externalId: i,
            zombieId: zombie.id,
          }),
        );
        items = itemRepository.create(items);
        await itemRepository.save(items);

        // Act
        const promise = handler.execute({
          zombieId: zombie.id,
          itemId: mockApiItems[0].id,
        });

        // Assert
        await expect(promise).rejects.toThrow(BadRequestException);
        await expect(promise).rejects.toThrow(
          `Zombie already has ${MAX_ZOMBIE_ITEMS} items`,
        );
      });
    });
  });

  it('throws NotFoundException if ApiItemDto is not returned by ItemService.getItems', async () => {
    // Arrange
    const zombie = zombieRepository.create(createZombie());
    await zombieRepository.save(zombie);

    // Act
    const promise = handler.execute({ zombieId: zombie.id, itemId: -1 });

    // Assert
    await expect(promise).rejects.toThrow(NotFoundException);
    await expect(promise).rejects.toThrow('Item');
  });

  it('throws NotFoundException if Zombie does not exist', async () => {
    // Arrange
    const id = faker.datatype.number();

    // Act
    const promise = handler.execute({
      zombieId: id,
      itemId: mockApiItems[0].id,
    });

    // Assert
    await expect(promise).rejects.toThrow(NotFoundException);
    await expect(promise).rejects.toThrow(ZombieEntity.name);
  });
});
