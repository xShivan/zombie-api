import { Provider } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ZombieRepository } from '../../zombie/zombie.repository';
import { Test } from '@nestjs/testing';

function getInMemoryModuleOptions(): TypeOrmModuleOptions {
  return {
    type: 'sqlite',
    database: ':memory:',
    autoLoadEntities: true,
    dropSchema: true,
    synchronize: true,
    logging: false,
  };
}

export function createTestingModule(providers: Provider[]) {
  return Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot(getInMemoryModuleOptions()),
      TypeOrmModule.forFeature([ZombieRepository]),
    ],
    providers: providers,
  }).compile();
}
