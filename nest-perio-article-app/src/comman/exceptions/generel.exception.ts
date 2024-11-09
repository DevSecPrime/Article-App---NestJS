import { HttpStatus } from '@nestjs/common';

export class GenerelException extends Error {
  status: number;
  constructor(status?: number, message?: string) {
    super(message);
    this.message = message || 'Internal server error.';
    this.status = HttpStatus.INTERNAL_SERVER_ERROR || 500;
  }
}
