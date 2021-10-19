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

@Module({
  imports: [TypeOrmModule.forFeature([ZombieRepository]), CqrsModule],
  controllers: [ZombieController],
  providers: [
    CreateZombieCommandHandler,
    UpdateZombieCommandHandler,
    DeleteZombieCommandHandler,
    GetZombiesQueryHandler,
    GetZombieQueryHandler,
  ],
})
export class ZombieModule {}
