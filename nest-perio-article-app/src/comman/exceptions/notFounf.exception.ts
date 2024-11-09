import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(message?: string) {
    super(message || 'NOT FOUND', HttpStatus.NOT_FOUND || 404);
  }
}
