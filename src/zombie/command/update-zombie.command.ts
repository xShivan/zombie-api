import { ZombieRepository } from '../zombie.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ZombieCreateDto } from '../dto/zombie-create.dto';
import { NotFoundException } from '@nestjs/common';

export class UpdateZombieCommand {
  constructor(public id: number, public dto: ZombieCreateDto) {}
}

@CommandHandler(UpdateZombieCommand)
export class UpdateZombieCommandHandler
  implements ICommandHandler<UpdateZombieCommand>
{
  constructor(
    @InjectRepository(ZombieRepository)
    private zombieRepository: ZombieRepository,
  ) {}

  async execute(command: UpdateZombieCommand): Promise<void> {
    let zombie = await this.zombieRepository.findOne({ id: command.id });

    if (!zombie) {
      throw new NotFoundException();
    }

    zombie = {
      ...zombie,
      ...command.dto,
    };

    await this.zombieRepository.save(zombie);
  }
}
