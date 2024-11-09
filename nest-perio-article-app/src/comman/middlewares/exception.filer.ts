import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { GenerelException } from '../exceptions/generel.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    //handle generel errror
    if (exception instanceof GenerelException) {
      res.status(status).json({
        status: status || HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: exception.message || 'Internal server error',
      });
    }

    //Handlin g exceptions
    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse();
      return res.status(status).json({
        status: status,
        success: false,
        message:
          typeof responseBody === 'string'
            ? responseBody
            : (responseBody as any).message || 'Error',
      });
    }

    //handling other exceptions
    return res.status(status).json({
      status: status || HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      error: exception.message || 'Internal server error',
      message: 'Something went wrong.',
    });
  }
}
