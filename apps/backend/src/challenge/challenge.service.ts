import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChallengeDto, UpdateChallengeDto } from './dto';
import { Challenge } from '@prisma/client';

@Injectable()
export class ChallengeService {
  constructor(private prisma: PrismaService) {}

  async create(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    const data = {
      title: createChallengeDto.title,
      description: createChallengeDto.description || '',
      difficulty: createChallengeDto.difficulty,
      tags: createChallengeDto.tags || [],
      category: createChallengeDto.category,
    };

    return this.prisma.challenge.create({
      data,
    });
  }

  async getAll(): Promise<Challenge[]> {
    return this.prisma.challenge.findMany();
  }

  async getRandom(): Promise<Challenge> {
    const count = await this.prisma.challenge.count();
    if (count === 0) {
      throw new NotFoundException('No challenges found');
    }

    const skip = Math.floor(Math.random() * count);
    const challenge = await this.prisma.challenge.findFirst({
      skip,
    });

    return challenge;
  }

  async update(
    id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    const numericId = this.parseId(id);
    await this.findChallengeById(numericId);

    return this.prisma.challenge.update({
      where: { id: numericId },
      data: updateChallengeDto,
    });
  }

  async delete(id: string): Promise<Challenge> {
    const numericId = this.parseId(id);
    await this.findChallengeById(numericId);

    return this.prisma.challenge.delete({
      where: { id: numericId },
    });
  }

  private parseId(id: string): number {
    return parseInt(id, 10);
  }

  private async findChallengeById(id: number): Promise<Challenge> {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
    });

    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }

    return challenge;
  }
}
