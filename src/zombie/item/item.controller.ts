import { Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AddItemCommand } from './command/add-item.command';
import { DeleteItemCommand } from './command/delete-item.command';

@Controller('zombie/:zombieId/item')
export class ItemController {
  constructor(private commandBus: CommandBus) {}

  @Post(':id')
  add(
    @Param('zombieId', ParseIntPipe) zombieId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.commandBus.execute(new AddItemCommand(zombieId, id));
  }

  @Delete(':id')
  delete(
    @Param('zombieId', ParseIntPipe) zombieId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.commandBus.execute(new DeleteItemCommand(zombieId, id));
  }
}
