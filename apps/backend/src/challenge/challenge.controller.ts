import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto, UpdateChallengeDto } from './dto';
import { Challenge } from '@prisma/client';

@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Post()
  create(@Body() createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    return this.challengeService.create(createChallengeDto);
  }

  @Get()
  getAll(): Promise<Challenge[]> {
    return this.challengeService.getAll();
  }

  @Get('random')
  getRandom(): Promise<Challenge> {
    return this.challengeService.getRandom();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    return this.challengeService.update(id, updateChallengeDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Challenge> {
    return this.challengeService.delete(id);
  }
}
