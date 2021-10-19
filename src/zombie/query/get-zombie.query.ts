import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ZombieRepository } from '../zombie.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ZombieDetailsDto } from '../dto/zombie-details.dto';
import { NotFoundException } from '@nestjs/common';

export class GetZombieQuery {
  constructor(public id: number) {}
}

@QueryHandler(GetZombieQuery)
export class GetZombieQueryHandler implements IQueryHandler<ZombieDetailsDto> {
  constructor(
    @InjectRepository(ZombieRepository)
    private zombieRepository: ZombieRepository,
  ) {}

  async execute(query: GetZombieQuery): Promise<ZombieDetailsDto> {
    const zombie = await this.zombieRepository.findOne({ id: query.id });

    if (!zombie) {
      throw new NotFoundException();
    }

    return {
      id: zombie.id,
      name: zombie.name,
      createdAt: zombie.createdAt,
    };
  }
}
