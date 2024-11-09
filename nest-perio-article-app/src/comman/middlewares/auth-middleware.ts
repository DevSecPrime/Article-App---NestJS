import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { AccessTokenService } from 'src/api/access_token/access_token.service';

dotenv.config();

@Injectable()
export class AuthRevocationGuard implements CanActivate {
  constructor(private readonly accessTokenService: AccessTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const authorizationHeader = request.header('Authorization');

    if (!authorizationHeader) {
      throw new NotFoundException('Authorization header is missing.');
    }

    const token = authorizationHeader.replace('Bearer ', '').trim();
    if (!token) {
      throw new NotFoundException('Token is not provided.');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      request.user = decoded;
    } catch (error) {
      throw new UnauthorizedException('Token verification failed.');
    }

    return true;
  }
}
