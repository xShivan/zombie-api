import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DatabaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'zombie.db',
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
};

export default DatabaseConfig;
