import { Module } from '@nestjs/common';
import { ZombieController } from './zombie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZombieRepository } from './zombie.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateZombieCommandHandler } from './command/create-zombie.command';
import { GetZombiesQueryHandler } from './query/get-zombies.query';
import { GetZombieQueryHandler } from './query/get-zombie.query';
import { UpdateZombieCommandHandler } from './command/update-zombie.command';
import { DeleteZombieCommandHandler } from './command/delete-zombie.command';
import { ItemController } from './item/item.controller';
import { HttpModule } from '@nestjs/axios';
import { ItemService } from './item/item.service';
import { AddItemCommandHandler } from './item/command/add-item.command';
import { ItemRepository } from './item/item.repository';
import { DeleteItemCommandHandler } from './item/command/delete-item.command';

@Module({
  imports: [
    TypeOrmModule.forFeature([ZombieRepository, ItemRepository]),
    CqrsModule,
    HttpModule,
  ],
  controllers: [ZombieController, ItemController],
  providers: [
    CreateZombieCommandHandler,
    UpdateZombieCommandHandler,
    DeleteZombieCommandHandler,
    GetZombiesQueryHandler,
    GetZombieQueryHandler,
    ItemService,
    AddItemCommandHandler,
    DeleteItemCommandHandler,
  ],
})
export class ZombieModule {}
