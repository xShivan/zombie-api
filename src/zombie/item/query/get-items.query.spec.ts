import { ZombieRepository } from '../../zombie.repository';
import { TestingModule } from '@nestjs/testing';
import { createTestingModule } from '../../../shared/util/testing.util';
import { ItemRepository } from '../item.repository';
import { GetItemsQueryHandler } from './get-items.query';
import * as faker from 'faker';
import { NotFoundException } from '@nestjs/common';
import { ItemService } from '../item.service';
import { ItemServiceMock, mockApiItems } from '../item-testing.util';
import { ExchangeRateService } from '../../../shared/exchange-rate.service';
import {
  ExchangeRateServiceMock,
  mockExchangeRates,
} from '../../../shared/exchange-rate-testing.util';
import { createZombie } from '../../zombie-testing.util';

const eurRate = mockExchangeRates.find((rate) => rate.code === 'EUR').ask;
const usdRate = mockExchangeRates.find((rate) => rate.code === 'USD').ask;

describe('GetItemsCommand', () => {
  let handler: GetItemsQueryHandler;
  let zombieRepository: ZombieRepository;
  let itemRepository: ItemRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await createTestingModule([
      GetItemsQueryHandler,
      { provide: ItemService, useClass: ItemServiceMock },
      { provide: ExchangeRateService, useClass: ExchangeRateServiceMock },
    ]);
    handler = module.get<GetItemsQueryHandler>(GetItemsQueryHandler);
    zombieRepository = module.get<ZombieRepository>(ZombieRepository);
    itemRepository = module.get<ItemRepository>(ItemRepository);
  });

  afterEach(async () => {
    await module.close();
  });

  it('maps items', async () => {
    // Arrange
    const itemDto = mockApiItems[0];

    const zombie = zombieRepository.create(createZombie());
    await zombieRepository.save(zombie);

    const item = itemRepository.create({
      zombieId: zombie.id,
      externalId: itemDto.id,
    });

    await itemRepository.save(item);

    // Act
    const result = await handler.execute({ zombieId: zombie.id });

    // Assert
    expect(result.items.length).toBe(1);

    const resultItem = result.items[0];
    expect(resultItem.name).toBe(itemDto.name);
    expect(resultItem.price).toBe(itemDto.price);
    expect(resultItem.priceEur).toBe(resultItem.price * eurRate);
    expect(resultItem.priceUsd).toBe(resultItem.price * usdRate);
  });

  it('sums totals', async () => {
    // Arrange
    const itemDto1 = mockApiItems[0];
    const itemDto2 = mockApiItems[1];

    const zombie = zombieRepository.create(createZombie());
    await zombieRepository.save(zombie);

    const item1 = itemRepository.create({
      zombieId: zombie.id,
      externalId: itemDto1.id,
    });
    const item2 = itemRepository.create({
      zombieId: zombie.id,
      externalId: itemDto2.id,
    });

    await itemRepository.save([item1, item2]);

    // Act
    const result = await handler.execute({ zombieId: zombie.id });

    // Assert
    expect(result.total).toBe(itemDto1.price + itemDto2.price);
    expect(result.totalEur).toBe((itemDto1.price + itemDto2.price) * eurRate);
    expect(result.totalUsd).toBe((itemDto1.price + itemDto2.price) * usdRate);
  });

  it('throws NotFoundException if Zombie does not exist', async () => {
    // Arrange
    const zombieId = faker.datatype.number();

    // Act & assert
    await expect(handler.execute({ zombieId })).rejects.toThrow(
      NotFoundException,
    );
  });
});
