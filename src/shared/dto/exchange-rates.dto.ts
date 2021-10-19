import { ExchangeRateDto } from './exchange-rate.dto';

export class ExchangeRatesDto {
  table: string;
  no: string;
  effectiveDate: string;
  tradingDate: string;
  rates: ExchangeRateDto[];
}
