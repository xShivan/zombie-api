import * as faker from 'faker';
import { ApiItemDto } from './dto/api-item.dto';

export const mockApiItems: ApiItemDto[] = [
  {
    id: faker.datatype.number(),
    name: faker.lorem.word(),
    price: faker.datatype.number(),
  },
  {
    id: faker.datatype.number(),
    name: faker.lorem.word(),
    price: faker.datatype.number(),
  },
];

export class ItemServiceMock {
  getAll(): Promise<ApiItemDto[]> {
    return Promise.resolve(mockApiItems);
  }
}
