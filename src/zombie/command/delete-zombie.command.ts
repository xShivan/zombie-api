import { ZombieRepository } from '../zombie.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

export class DeleteZombieCommand {
  constructor(public id: number) {}
}

@CommandHandler(DeleteZombieCommand)
export class DeleteZombieCommandHandler
  implements ICommandHandler<DeleteZombieCommand>
{
  constructor(
    @InjectRepository(ZombieRepository)
    private zombieRepository: ZombieRepository,
  ) {}

  async execute(command: DeleteZombieCommand): Promise<void> {
    const zombie = await this.zombieRepository.findOne({ id: command.id });

    if (!zombie) {
      throw new NotFoundException();
    }

    await this.zombieRepository.delete(zombie.id);
  }
}
