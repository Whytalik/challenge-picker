import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ValidationPipe,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
      origin: ['http://localhost:5173', 'http://localhost:4173'],
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true,
    });

    app.useGlobalFilters(new GlobalExceptionFilter());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        errorHttpStatusCode: 422,
        exceptionFactory: (errors) => {
          const result = errors.map((error) => ({
            property: error.property,
            message: error.constraints
              ? Object.values(error.constraints)[0]
              : 'Validation error',
          }));
          return new ValidationError(result);
        },
      }),
    );

    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    logger.error(
      `Error starting server: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

class ValidationError extends HttpException {
  constructor(errors: any[]) {
    super(
      { message: 'Validation failed', errors },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

void bootstrap();
