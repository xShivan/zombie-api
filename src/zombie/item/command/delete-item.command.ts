import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemRepository } from '../item.repository';
import { NotFoundException } from '@nestjs/common';

export class DeleteItemCommand {
  constructor(public zombieId: number, public itemId: number) {}
}

@CommandHandler(DeleteItemCommand)
export class DeleteItemCommandHandler
  implements ICommandHandler<DeleteItemCommand>
{
  constructor(
    @InjectRepository(ItemRepository)
    private readonly itemRepository: ItemRepository,
  ) {}

  async execute(command: DeleteItemCommand): Promise<void> {
    const item = await this.itemRepository.findOne({
      zombieId: command.zombieId,
      externalId: command.itemId,
    });

    if (!item) {
      throw new NotFoundException();
    }

    await this.itemRepository.delete({ id: item.id });
  }
}
