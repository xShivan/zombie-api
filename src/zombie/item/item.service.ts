import { Injectable, Logger } from '@nestjs/common';
import { ApiItemDto } from './dto/api-item.dto';
import { CachedBaseService } from '../../shared/cached-base.service';
import { ApiItemsDto } from './dto/api-items.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ItemService extends CachedBaseService<ApiItemDto> {
  protected readonly apiUrl =
    'https://zombie-items-api.herokuapp.com/api/items';
  protected readonly logger = new Logger(ItemService.name);

  constructor(httpService: HttpService) {
    super(httpService);
  }

  protected processResponse(response: ApiItemsDto): ApiItemDto[] {
    return response.items;
  }
}
