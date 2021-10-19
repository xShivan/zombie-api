import { ExchangeRateDto } from './dto/exchange-rate.dto';

export const mockExchangeRates: ExchangeRateDto[] = [
  {
    currency: 'Euro',
    code: 'EUR',
    bid: 4,
    ask: 5,
  },
  {
    currency: 'Dollar',
    code: 'USD',
    bid: 4,
    ask: 3,
  },
];

export class ExchangeRateServiceMock {
  getAll(): Promise<ExchangeRateDto[]> {
    return Promise.resolve(mockExchangeRates);
  }
}
