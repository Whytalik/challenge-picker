import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Injectable()
export class ChallengeService {
  constructor(private prisma: PrismaService) {}

  async create(createChallengeDto: CreateChallengeDto) {
    const data = {
      title: createChallengeDto.title,
      description: createChallengeDto.description || '',
      difficulty: createChallengeDto.difficulty,
      tags: createChallengeDto.tags || [],
      category: createChallengeDto.category,
    };

    const challenge = await this.prisma.challenge.create({
      data,
    });

    return challenge;
  }

  async getAll() {
    const challenges = await this.prisma.challenge.findMany();
    return challenges;
  }

  async getRandom() {
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

  async update(id: string, updateChallengeDto: UpdateChallengeDto) {
    const numericId = parseInt(id, 10);

    const challenge = await this.prisma.challenge.findUnique({
      where: { id: numericId },
    });

    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }

    const updatedChallenge = await this.prisma.challenge.update({
      where: { id: numericId },
      data: updateChallengeDto,
    });

    return updatedChallenge;
  }

  async delete(id: string) {
    const numericId = parseInt(id, 10);

    const challenge = await this.prisma.challenge.findUnique({
      where: { id: numericId },
    });

    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }

    const deletedChallenge = await this.prisma.challenge.delete({
      where: { id: numericId },
    });

    return deletedChallenge;
  }
}
