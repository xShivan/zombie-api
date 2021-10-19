import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

export abstract class CachedBaseService<TItem> {
  protected abstract readonly logger: Logger;
  private itemsCheckedAt: Date = null;
  private cachedItems: TItem[];

  protected abstract readonly apiUrl: string;
  protected abstract processResponse(response: any): TItem[];

  protected constructor(protected readonly httpService: HttpService) {}

  async getAll() {
    const now = new Date();

    if (!this.itemsCheckedAt || !this.isSameDay(now)) {
      this.cachedItems = await this.getItemsFromApi();
      this.itemsCheckedAt = now;
    }

    return this.cachedItems;
  }

  private async getItemsFromApi(): Promise<TItem[]> {
    let response: AxiosResponse;

    try {
      response = await this.httpService.get(this.apiUrl).toPromise();
    } catch (e) {
      this.handleHttpError(e, this.apiUrl);
    }

    return this.processResponse(response.data);
  }

  private handleHttpError(e: Error, url: string, type = 'GET'): void {
    this.logger.error(`Could not preform ${type}: ${url}.`);
    throw e;
  }

  private isSameDay(now: Date): boolean {
    return this.itemsCheckedAt.getDate() === now.getDate();
  }
}
