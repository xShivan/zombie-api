import { IsNotEmpty } from 'class-validator';

export class ZombieCreateDto {
  @IsNotEmpty()
  public name: string;
}
