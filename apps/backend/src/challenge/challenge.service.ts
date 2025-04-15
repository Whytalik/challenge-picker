import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';

@Injectable()
export class ChallengeService {
  constructor(private prisma: PrismaService) {}

  async create(createChallengeDto: CreateChallengeDto) {
    return this.prisma.challenge.create({
      data: createChallengeDto,
    });
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
}
