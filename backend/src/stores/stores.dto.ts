import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { User } from '../users/users.entity';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;
}

export class UpdateStoreDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;
}

export class ReadStoreDto {
  readonly uuid: string;
  readonly name: string;
  readonly description: string;
  readonly coverUrl: string;
  @Exclude()
  user: User;

  constructor(partial: Partial<ReadStoreDto>) {
    Object.assign(this, partial);
  }
}
