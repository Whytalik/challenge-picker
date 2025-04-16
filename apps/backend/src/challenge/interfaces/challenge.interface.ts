import { Difficulty } from '../enums/difficulty.enum';

export interface Challenge {
  id: number;
  title: string;
  description: string | null;
  difficulty: Difficulty;
  tags: string[];
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
}
