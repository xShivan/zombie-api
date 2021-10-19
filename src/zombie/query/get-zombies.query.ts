import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ZombieRepository } from '../zombie.repository';
import { ZombieDto } from '../dto/zombie.dto';

export class GetZombiesQuery {}

@QueryHandler(GetZombiesQuery)
export class GetZombiesQueryHandler implements IQueryHandler<ZombieDto[]> {
  constructor(
    @InjectRepository(ZombieRepository)
    private zombieRepository: ZombieRepository,
  ) {}

  async execute(query: GetZombiesQuery): Promise<ZombieDto[]> {
    const zombies = await this.zombieRepository.find({});
    return zombies.map((z) => ({
      id: z.id,
      name: z.name,
    }));
  }
}
