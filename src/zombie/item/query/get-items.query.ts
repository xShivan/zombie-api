import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ZombieItemsDto } from '../dto/zombie-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ZombieRepository } from '../../zombie.repository';
import { NotFoundException } from '@nestjs/common';
import { ItemService } from '../item.service';
import { ExchangeRateService } from '../../../shared/exchange-rate.service';
import { ZombieEntity } from '../../zombie.entity';

export class GetItemsQuery {
  constructor(public zombieId: number) {}
}

@QueryHandler(GetItemsQuery)
export class GetItemsQueryHandler
  implements IQueryHandler<GetItemsQuery, ZombieItemsDto>
{
  private eurRate: number;
  private usdRate: number;

  constructor(
    @InjectRepository(ZombieRepository)
    private readonly zombieRepository: ZombieRepository,
    private readonly itemService: ItemService,
    private readonly exchangeRateService: ExchangeRateService,
  ) {}

  async execute(query: GetItemsQuery): Promise<ZombieItemsDto> {
    const zombie = await this.getZombie(query);
    await this.loadExchangeRates();
    return await this.getItems(zombie);
  }

  private async getZombie(query: GetItemsQuery) {
    const zombie = await this.zombieRepository.findOne({
      where: { id: query.zombieId },
      relations: ['items'],
    });

    if (!zombie) {
      throw new NotFoundException();
    }
    return zombie;
  }

  private async loadExchangeRates(): Promise<void> {
    const exchangeRates = await this.exchangeRateService.getAll();

    this.eurRate = exchangeRates.find((rate) => rate.code === 'EUR').ask;
    this.usdRate = exchangeRates.find((rate) => rate.code === 'USD').ask;
  }

  private async getItems(zombie: ZombieEntity) {
    const itemDtos = await this.itemService.getAll();
    const resultItems = zombie.items.map((it) => {
      const itemDto = itemDtos.find((dto) => dto.id === it.externalId);

      return {
        id: it.externalId,
        name: itemDto.name,
        price: itemDto.price,
        priceEur: GetItemsQueryHandler.toDecimal(itemDto.price * this.eurRate),
        priceUsd: GetItemsQueryHandler.toDecimal(itemDto.price * this.usdRate),
      };
    });

    const prices = resultItems.map((resultItem) => resultItem.price);
    const total = prices.reduce((acc, price) => acc + price, 0);

    return {
      items: resultItems,
      total: total,
      totalEur: GetItemsQueryHandler.toDecimal(total * this.eurRate),
      totalUsd: GetItemsQueryHandler.toDecimal(total * this.usdRate),
    };
  }

  private static toDecimal(value: number): number {
    return Number(value.toFixed(2));
  }
}
