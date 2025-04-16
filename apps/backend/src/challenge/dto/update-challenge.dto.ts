import { IsString, IsOptional } from 'class-validator';
import type { ValidationOptions } from 'class-validator';

export class UpdateChallengeDto {
  @IsString({
    message: 'Title must be a string',
  } as ValidationOptions)
  @IsOptional()
  title?: string;

  @IsString({
    message: 'Description must be a string',
  } as ValidationOptions)
  @IsOptional()
  description?: string;
}
