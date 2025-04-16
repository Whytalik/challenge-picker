import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS to allow requests from the frontend
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

void bootstrap().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error('Application failed to start:', error.message);
  } else {
    console.error('Application failed to start with unknown error:', error);
  }
  process.exit(1);
});
