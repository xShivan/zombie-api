import { Module } from '@nestjs/common';
import { ZombieController } from './zombie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZombieRepository } from './zombie.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateZombieCommandHandler } from './command/create-zombie.command';
import { GetZombiesQueryHandler } from './query/get-zombies.query';
import { GetZombieQueryHandler } from './query/get-zombie.query';

@Module({
  imports: [TypeOrmModule.forFeature([ZombieRepository]), CqrsModule],
  controllers: [ZombieController],
  providers: [
    CreateZombieCommandHandler,
    GetZombiesQueryHandler,
    GetZombieQueryHandler,
  ],
})
export class ZombieModule {}
