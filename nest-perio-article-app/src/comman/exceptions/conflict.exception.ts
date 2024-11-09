import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictExceptiion extends HttpException {
  constructor(message?: string) {
    super(message || 'CONFLICT', HttpStatus.CONFLICT || 409);
  }
}
