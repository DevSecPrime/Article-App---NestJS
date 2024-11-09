import { HttpException, HttpStatus } from '@nestjs/common';

export class UNAuthorizedException extends HttpException {
  constructor(message?: string) {
    super(message || 'UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
  }
}
