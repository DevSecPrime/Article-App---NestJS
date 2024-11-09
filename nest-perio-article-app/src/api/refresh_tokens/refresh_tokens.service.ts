import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refresh_token.entity';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';
import { encrypt } from 'src/comman/helpers/comman.helper';
import * as moment from 'moment';
dotenv.config();
@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  //find refresh token by token id
  /**
   * Find refresh token by id
   * @param id string
   * @returns
   */
  async findOne(id: string): Promise<RefreshToken> {
    return await this.refreshTokenRepository.findOne({
      where: { id },
      relations: ['accessToken', 'accessToken.user'],
    });
  }

  //create token
  async createRefreshToken(decodedToken: any): Promise<any> {
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenLifeTime = moment
      .unix(decodedToken.exp)
      .add(30, 'd')
      .toDate();
    //create token
    await this.refreshTokenRepository.save(
      this.refreshTokenRepository.create({
        id: refreshToken,
        accessTokens: decodedToken.jti,
        expiresAt: refreshTokenLifeTime,
      }),
    );

    return encrypt(refreshToken);
  }
}
