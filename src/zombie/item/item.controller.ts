import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AddItemCommand } from './command/add-item.command';
import { DeleteItemCommand } from './command/delete-item.command';
import { ZombieItemsDto } from './dto/zombie-item.dto';
import { GetItemsQuery } from './query/get-items.query';

@Controller('zombie/:zombieId/item')
export class ItemController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get()
  getAll(
    @Param('zombieId', ParseIntPipe) zombieId: number,
  ): Promise<ZombieItemsDto> {
    return this.queryBus.execute(new GetItemsQuery(zombieId));
  }

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
