import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessToken } from './entity/accessToken.entity';
import { Repository } from 'typeorm';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
dotenv.config();

@Injectable()
export class AccessTokenService {
  constructor(
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
  ) {}
  /**
   * Create token
   * @param userId number
   * @returns
   */
  async createToken(userId: number): Promise<any> {
    const jti = crypto.randomBytes(32).toString('hex');

    const payload = {
      jti,
      sub: userId,
    };
    //geenrate token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    //decode token for store it to database
    const decodedToken = await jwt.decode(token);

    //store token
    await this.storeToken(userId, jti, decodedToken);
    //returmn token
    return token;
  }

  /**
   * Store token in databse
   * @param userId number
   * @param jti string
   * @param decodedToken string
   */
  async storeToken(
    userId: number,
    jti: string,
    decodedToken: any,
  ): Promise<any> {
    const accessToken = new AccessToken();
    accessToken.id = jti;
    accessToken.user = { id: userId } as any;
    accessToken.expiresAt = moment.unix(decodedToken.exp).toDate() as any;
    //save token with the given credentials
    await this.accessTokenRepository.save(accessToken);
  }

  //find token
  async findOne(id: any): Promise<any> {
    return await this.accessTokenRepository.findOne({ where: { id } });
  }
}
