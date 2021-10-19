import { IsNotEmpty } from 'class-validator';

export class ZombieUpdateDto {
  @IsNotEmpty()
  name: string;
}
