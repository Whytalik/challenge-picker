import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: Record<string, unknown> = {};

    this.logger.error(
      `Exception ${exception instanceof Error ? exception.name : 'Unknown'}: ${
        exception instanceof Error ? exception.message : 'Unknown error'
      }`,
    );

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const exceptionResponseObj = exceptionResponse as Record<
          string,
          unknown
        >;
        message =
          typeof exceptionResponseObj.message === 'string'
            ? exceptionResponseObj.message
            : message;
        error =
          typeof exceptionResponseObj.errors === 'object' &&
          exceptionResponseObj.errors !== null
            ? (exceptionResponseObj.errors as Record<string, unknown>)
            : {};
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    } else if (exception instanceof PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;

      switch (exception.code) {
        case 'P2002': {
          message = 'Unique constraint violation';
          const target = exception.meta?.target;
          error = { field: Array.isArray(target) ? target : 'unknown field' };
          break;
        }
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          break;
        default:
          message = `Database error: ${exception.code}`;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(
      `HTTP Error: ${request.method} ${request.url} | Status: ${status} | Message: ${message}`,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(Object.keys(error).length > 0 && { errors: error }),
    });
  }
}
