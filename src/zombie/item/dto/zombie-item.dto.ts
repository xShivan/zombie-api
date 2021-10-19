import { ItemDto } from './item.dto';

export class ZombieItemsDto {
  public items: ItemDto[];
  public total: number;
  public totalUsd: number;
  public totalEur: number;
}
