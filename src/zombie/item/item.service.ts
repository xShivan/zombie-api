import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiItemDto } from './dto/api-item.dto';
import { AxiosResponse } from 'axios';
import { ApiItemsDto } from './dto/api-items.dto';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);
  private itemsCheckedAt: Date = null;
  private cachedItems: ApiItemDto[];

  constructor(private readonly httpService: HttpService) {}

  async getItems(): Promise<ApiItemDto[]> {
    const now = new Date();

    if (!this.itemsCheckedAt || this.itemsCheckedAt.getDate() !== now.getDate()) {
      this.cachedItems = await this.getItemsFromApi();
      this.itemsCheckedAt = now;
    }

    return this.cachedItems;
  }

  private async getItemsFromApi(): Promise<ApiItemDto[]> {
    const ITEMS_URL = 'https://zombie-items-api.herokuapp.com/api/items';

    let response: AxiosResponse<ApiItemsDto>;

    try {
      response = await this.httpService.get<ApiItemsDto>(ITEMS_URL).toPromise();
    } catch (e) {
      this.handleHttpError(e, ITEMS_URL);
    }

    return response.data.items;
  }

  private handleHttpError(e: Error, url: string, type = 'GET'): void {
    this.logger.error(`Could not preform ${type}: ${url}.`);
    throw e;
  }
}
