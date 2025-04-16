import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';
import type { ValidationOptions } from 'class-validator';
import { Difficulty } from '../enums';

export class CreateChallengeDto {
  @IsString({
    message: 'Title must be a string',
  } as ValidationOptions)
  @IsNotEmpty({
    message: 'Title is required',
  } as ValidationOptions)
  title: string;

  @IsOptional()
  @IsString({
    message: 'Description must be a string',
  } as ValidationOptions)
  description?: string;

  @IsOptional()
  @IsEnum(Difficulty, {
    message: 'Difficulty must be one of: easy, medium, hard',
  } as ValidationOptions)
  difficulty?: Difficulty;

  @IsOptional()
  @IsArray({
    message: 'Tags must be an array of strings',
  } as ValidationOptions)
  @IsString({
    each: true,
    message: 'Each tag must be a string',
  } as ValidationOptions)
  tags?: string[];

  @IsOptional()
  @IsString({
    message: 'Category must be a string',
  } as ValidationOptions)
  category?: string;
}
