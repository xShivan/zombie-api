import { ZombieRepository } from '../zombie.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ValueDto } from '../../shared/dto/value.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ZombieCreateDto } from '../dto/zombie-create.dto';

export class CreateZombieCommand {
  constructor(public dto: ZombieCreateDto) {}
}

@CommandHandler(CreateZombieCommand)
export class CreateZombieCommandHandler
  implements ICommandHandler<CreateZombieCommand, ValueDto<number>>
{
  constructor(
    @InjectRepository(ZombieRepository)
    private zombieRepository: ZombieRepository,
  ) {}

  async execute(command: CreateZombieCommand): Promise<ValueDto<number>> {
    const zombie = this.zombieRepository.create({
      ...command.dto,
    });

    await this.zombieRepository.save(zombie);

    return new ValueDto(zombie.id);
  }
}
