import { Injectable, Logger } from '@nestjs/common';
import { ExchangeRateDto } from './dto/exchange-rate.dto';
import { ExchangeRatesDto } from './dto/exchange-rates.dto';
import { CachedBaseService } from './cached-base.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ExchangeRateService extends CachedBaseService<ExchangeRateDto> {
  protected readonly logger = new Logger(ExchangeRateService.name);
  readonly apiUrl = 'http://api.nbp.pl/api/exchangerates/tables/C/today/';

  constructor(httpService: HttpService) {
    super(httpService);
  }

  processResponse(response: ExchangeRatesDto[]): ExchangeRateDto[] {
    return response[0].rates;
  }
}
