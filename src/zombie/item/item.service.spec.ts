import { Test, TestingModule } from '@nestjs/testing';
import { ItemService } from './item.service';
import { HttpService } from '@nestjs/axios';

describe('ItemService', () => {
  let service: ItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        { provide: HttpService, useFactory: () => ({}) },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
