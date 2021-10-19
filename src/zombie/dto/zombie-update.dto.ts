import { IsNotEmpty } from 'class-validator';

export class ZombieUpdateDto {
  @IsNotEmpty()
  public name: string;
}
