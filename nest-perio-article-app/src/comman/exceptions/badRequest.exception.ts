import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(message?: string) {
    super((message = message || 'BAD REQUEST'), HttpStatus.BAD_REQUEST || 400);
  }
}
