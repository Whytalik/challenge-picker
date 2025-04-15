import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ChallengeModule } from './challenge/challenge.module';

@Module({
  imports: [PrismaModule, ChallengeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
