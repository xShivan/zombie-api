import { Module } from '@nestjs/common';
import { ZombieController } from './zombie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZombieRepository } from './zombie.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateZombieCommandHandler } from './command/create-zombie.command';

@Module({
  imports: [TypeOrmModule.forFeature([ZombieRepository]), CqrsModule],
  controllers: [ZombieController],
  providers: [CreateZombieCommandHandler],
})
export class ZombieModule {}
