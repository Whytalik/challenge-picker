import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeService } from './challenge.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import type { Challenge } from '@prisma/client';

describe('ChallengeService', () => {
  let service: ChallengeService;
  let prismaService: {
    challenge: jest.Mocked<{
      create: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
    }>;
  };

  const mockChallenge: Challenge = {
    id: 1,
    title: 'Test Challenge',
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      challenge: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengeService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ChallengeService>(ChallengeService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a challenge', async () => {
      const createChallengeDto = {
        title: 'Test Challenge',
        description: 'Test Description',
      };

      (prismaService.challenge.create as jest.Mock).mockResolvedValue(
        mockChallenge,
      );

      const result = await service.create(createChallengeDto);

      expect(prismaService.challenge.create).toHaveBeenCalledWith({
        data: createChallengeDto,
      });
      expect(result).toEqual(mockChallenge);
    });
  });

  describe('getRandom', () => {
    it('should return a random challenge when challenges exist', async () => {
      (prismaService.challenge.count as jest.Mock).mockResolvedValue(1);
      (prismaService.challenge.findMany as jest.Mock).mockResolvedValue([
        mockChallenge,
      ]);

      const result = await service.getRandom();

      expect(prismaService.challenge.findMany).toHaveBeenCalledWith({
        take: 1,
        skip: expect.any(Number) as number,
      });
      expect(result).toEqual(mockChallenge);
    });

    it('should throw NotFoundException when no challenges exist', async () => {
      (prismaService.challenge.count as jest.Mock).mockResolvedValue(0);

      await expect(service.getRandom()).rejects.toThrow(NotFoundException);
      expect(prismaService.challenge.findMany).not.toHaveBeenCalled();
    });
  });
});
