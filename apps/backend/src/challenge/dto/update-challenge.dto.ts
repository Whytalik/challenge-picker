import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import type { ValidationOptions } from 'class-validator';
import { Difficulty } from '../enums';

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

  @IsEnum(Difficulty, {
    message: 'Difficulty must be one of: easy, medium, hard',
  } as ValidationOptions)
  @IsOptional()
  difficulty?: Difficulty;

  @IsArray({
    message: 'Tags must be an array of strings',
  } as ValidationOptions)
  @IsString({
    each: true,
    message: 'Each tag must be a string',
  } as ValidationOptions)
  @IsOptional()
  tags?: string[];

  @IsString({
    message: 'Category must be a string',
  } as ValidationOptions)
  @IsOptional()
  category?: string;
}
