import { ExchangeRateDto } from './exchange-rate.dto';

export interface ExchangeRatesDto {
  table: string;
  no: string;
  effectiveDate: string;
  tradingDate: string;
  rates: ExchangeRateDto[];
}
