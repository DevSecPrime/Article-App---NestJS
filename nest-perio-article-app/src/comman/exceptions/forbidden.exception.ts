import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(message?: string) {
    super(message || 'FORBIDDEN', HttpStatus.FORBIDDEN || 403);
  }
}
