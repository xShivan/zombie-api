import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ZombieRepository } from '../../zombie.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemService } from '../item.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MAX_ZOMBIE_ITEMS, ZombieEntity } from '../../zombie.entity';
import { ItemRepository } from '../item.repository';

export class AddItemCommand {
  constructor(public zombieId: number, public itemId: number) {}
}

@CommandHandler(AddItemCommand)
export class AddItemCommandHandler implements ICommandHandler {
  constructor(
    @InjectRepository(ZombieRepository)
    private readonly zombieRepository: ZombieRepository,
    @InjectRepository(ItemRepository)
    private readonly itemRepository: ItemRepository,
    private readonly itemService: ItemService,
  ) {}

  async execute(command: AddItemCommand): Promise<void> {
    const zombie = await this.getZombie(command);
    this.validateZombieItems(zombie, command);
    const itemDto = await this.getItem(command);
    await this.saveItem(itemDto, zombie);
  }

  private async getZombie(command: AddItemCommand) {
    const zombie = await this.zombieRepository.findOne({
      relations: ['items'],
      where: {
        id: command.zombieId,
      },
    });

    if (!zombie) {
      throw new NotFoundException(ZombieEntity.name);
    }

    return zombie;
  }

  private validateZombieItems(zombie: ZombieEntity, command: AddItemCommand) {
    if (zombie.items.length >= MAX_ZOMBIE_ITEMS) {
      throw new BadRequestException(
        `Zombie already has ${MAX_ZOMBIE_ITEMS} items`,
      );
    }

    if (zombie.items.find((it) => it.externalId === command.itemId)) {
      throw new BadRequestException(
        `Zombie already has an item with ID ${command.itemId}`,
      );
    }
  }

  private async getItem(command: AddItemCommand) {
    const itemDtos = await this.itemService.getAll();
    const itemDto = await itemDtos.find((it) => it.id === command.itemId);

    if (!itemDto) {
      throw new NotFoundException('Item');
    }

    return itemDto;
  }

  private async saveItem(itemDto: any, zombie: ZombieEntity) {
    const item = this.itemRepository.create({
      externalId: itemDto.id,
      zombieId: zombie.id,
    });

    await this.itemRepository.save(item);
  }
}
