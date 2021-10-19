import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZombieModule } from './zombie/zombie.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import DatabaseConfig from './database.config';

@Module({
  imports: [ZombieModule, TypeOrmModule.forRoot(DatabaseConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
