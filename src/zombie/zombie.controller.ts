import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ZombieCreateDto } from './dto/zombie-create.dto';
import { ValueDto } from '../shared/dto/value.dto';
import { CreateZombieCommand } from './command/create-zombie.command';
import { ZombieDto } from './dto/zombie.dto';
import { GetZombiesQuery } from './query/get-zombies.query';
import { ZombieDetailsDto } from './dto/zombie-details.dto';
import { GetZombieQuery } from './query/get-zombie.query';
import { UpdateZombieCommand } from './command/update-zombie.command';
import { ZombieUpdateDto } from './dto/zombie-update.dto';

@Controller('zombie')
export class ZombieController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Get()
  getAll(): Promise<ZombieDto[]> {
    return this.queryBus.execute(new GetZombiesQuery());
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number): Promise<ZombieDetailsDto> {
    return this.queryBus.execute(new GetZombieQuery(id));
  }

  @Post()
  create(@Body() dto: ZombieCreateDto): Promise<ValueDto<number>> {
    return this.commandBus.execute(new CreateZombieCommand(dto));
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ZombieUpdateDto,
  ): Promise<void> {
    return this.commandBus.execute(new UpdateZombieCommand(id, dto));
  }
}
