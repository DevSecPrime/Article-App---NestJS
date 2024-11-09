import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
import { UsersService } from 'src/api/users/users.service';
import { AccessTokenService } from 'src/api/access_token/access_token.service';
dotenv.config();
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly accessTokenService: AccessTokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  /**
   * Validate token
   * @param payload object
   * @returns
   */
  async validate(payload: any): Promise<any> {
    const accessToken = await this.accessTokenService.findOne(payload.jti);
    const user = await this.userService.findById(payload.sub);
    if (!accessToken || !user) {
      throw new UnauthorizedException('Token is not authorized');
    }
    if (accessToken.isRevoked > 0) {
      throw new UnauthorizedException('Please, log in again.');
    }
    if (Date.now() > accessToken.expiresAt.getTime()) {
      throw new UnauthorizedException('Token`s expired.');
    }
    return { ...user, jti: payload.jti };
  }
}
