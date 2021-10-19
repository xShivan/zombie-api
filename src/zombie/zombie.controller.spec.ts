import { Test, TestingModule } from '@nestjs/testing';
import { ZombieController } from './zombie.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

describe('ZombieController', () => {
  let controller: ZombieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZombieController],
      providers: [
        { provide: CommandBus, useFactory: () => ({}) },
        { provide: QueryBus, useFactory: () => ({}) },
      ],
    }).compile();

    controller = module.get<ZombieController>(ZombieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
