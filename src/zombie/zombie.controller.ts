import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ZombieCreateDto } from './dto/zombie-create.dto';
import { ValueDto } from '../shared/dto/value.dto';
import { CreateZombieCommand } from './command/create-zombie.command';

@Controller('zombie')
export class ZombieController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Post()
  create(@Body() dto: ZombieCreateDto): Promise<ValueDto<number>> {
    return this.commandBus.execute(new CreateZombieCommand(dto));
  }
}
