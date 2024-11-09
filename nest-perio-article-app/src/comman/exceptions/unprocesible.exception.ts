import { HttpException, HttpStatus } from '@nestjs/common';

export class UNPrpcessibleException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'UNPROCESSABLE ENTITY',
      HttpStatus.UNPROCESSABLE_ENTITY || 422,
    );
  }
}
