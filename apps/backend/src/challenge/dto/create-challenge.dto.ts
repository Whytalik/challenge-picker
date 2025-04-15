import { IsString, IsNotEmpty } from 'class-validator';
import type { ValidationOptions } from 'class-validator';

export class CreateChallengeDto {
  @IsString({
    message: 'Title must be a string',
  } as ValidationOptions)
  @IsNotEmpty({
    message: 'Title is required',
  } as ValidationOptions)
  title: string;

  @IsString({
    message: 'Description must be a string',
  } as ValidationOptions)
  @IsNotEmpty({
    message: 'Description is required',
  } as ValidationOptions)
  description: string;
}
