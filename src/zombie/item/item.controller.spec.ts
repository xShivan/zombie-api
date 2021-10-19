import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

describe('ItemController', () => {
  let controller: ItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        { provide: CommandBus, useFactory: () => ({}) },
        { provide: QueryBus, useFactory: () => ({}) },
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
