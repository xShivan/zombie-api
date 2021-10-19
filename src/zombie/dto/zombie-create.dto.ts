import { IsNotEmpty } from 'class-validator';

export class ZombieCreateDto {
  @IsNotEmpty()
  name: string;
}
