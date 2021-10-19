import { ApiItemDto } from './api-item.dto';

export interface ApiItemsDto {
  timestamp: number;
  items: ApiItemDto[];
}
