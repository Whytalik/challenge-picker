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
    };

    return this.prisma.challenge.create({
      data,
    });
  }

  async getAll() {
    return this.prisma.challenge.findMany();
  }

  async getRandom() {
    const count = await this.prisma.challenge.count();

    if (count === 0) {
      throw new NotFoundException('No challenges available');
    }

    const skip = Math.floor(Math.random() * count);

    const [challenge] = await this.prisma.challenge.findMany({
      take: 1,
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

    return this.prisma.challenge.update({
      where: { id: numericId },
      data: updateChallengeDto,
    });
  }

  async delete(id: string) {
    const numericId = parseInt(id, 10);

    const challenge = await this.prisma.challenge.findUnique({
      where: { id: numericId },
    });

    if (!challenge) {
      throw new NotFoundException(`Challenge with ID ${id} not found`);
    }

    return this.prisma.challenge.delete({
      where: { id: numericId },
    });
  }
}
