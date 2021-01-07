import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private logger: Logger) {}

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      status,
      message:
        status !== HttpStatus.INTERNAL_SERVER_ERROR
          ? exception.message.error ||
            exception.response.message ||
            exception.message
          : `Internal server error: ${exception.message}`,
    };

    if (exception instanceof HttpException) {
      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(
          `${request.method} ${request.url}`,
          exception.stack,
          'ExceptionFilter',
        );
      } else {
        this.logger.error(
          `${request.method} ${request.url}`,
          JSON.stringify(errorResponse),
          'ExceptionFilter',
        );
      }
    } else {
      this.logger.error(exception.name, exception.stack, 'ExceptionFilter');
    }

    response.status(status).json(errorResponse);
  }
}
