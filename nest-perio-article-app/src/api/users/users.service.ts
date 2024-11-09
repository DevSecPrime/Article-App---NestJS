/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import * as moment from 'moment';
import { AccessTokenService } from '../access_token/access_token.service';
import * as jwt from 'jsonwebtoken';
import { RefreshTokensService } from '../refresh_tokens/refresh_tokens.service';
import { VerifyDto } from './dto/verify.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokensService,
  ) {}
  /**
   * Find user by id
   * @param id number
   * @returns
   */
  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }
  /**
   * Find by number
   * @param phoneNo number
   */
  async findByNumber(phoneNo: number): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ phoneNo: phoneNo })
      .getOne();
    if (user) {
      throw new BadRequestException(
        `User already registered with ${user.phoneNo} number`,
      );
    }
    return user;
  }
  /**
   * Generate otp
   * @returns otp
   */
  async generateOtp(): Promise<any> {
    let otp: number;
    let result: any;
    do {
      otp = Math.floor(Math.random() * (999999 - 100000)) + 100000;
      result = await this.userRepository
        .createQueryBuilder('user')
        .where({ otp: otp })
        .getOne();
    } while (result > 0);

    return otp;
  }

  /**
   *
   * @param userDto object
   * @returns
   */
  async createUser(userDto: UserDto): Promise<any> {
    //check if number is already exist
    await this.findByNumber(userDto.phoneNo);
    //generate otp
    const otp = await this.generateOtp();
    //save user
    const user = await this.userRepository.save(
      this.userRepository.create({
        ...userDto,
        otp: otp,
        otpExpiresAt: moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        otpVerifiedAt: null,
      }),
    );

    //genarte token pair access token and resfresh token
    const token = await this.generateTokenPair(user.id);
    return [user, token];
  }

  /**
   * Generatr token pair
   * @param userId number
   * @returns
   */
  async generateTokenPair(userId: number): Promise<any> {
    //const generate token
    const accessToken = await this.accessTokenService.createToken(userId);

    //decode token
    const decodedToken = jwt.decode(accessToken);
    console.log('decoded token', decodedToken);
    //generate refresh token via decode token from the decoded token data
    /* eslint-disable @typescript-eslint/no-var-requires */
    const refreshToken = await this.refreshTokenService.createRefreshToken(
      decodedToken,
    );

    return [accessToken, refreshToken];
  }

  /**
   * Verfy user
   * @param userVerifyDto object
   * @returns
   */
  async verifyUser(userVerifyDto: VerifyDto) {
    //chek if country code is in valid
    const countryCode = await this.userRepository.findOne({
      where: {
        countryCode: userVerifyDto.countryCode,
      },
    });
    if (!countryCode) {
      throw new BadRequestException('Inavlid country code.');
    }
    //chek if number is invalid
    const user = await this.userRepository.findOne({
      where: {
        phoneNo: userVerifyDto.phoneNo,
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid number.');
    }
    //chek if otp is valid, expired, or length of otp is != 6
    const currTime = moment().unix();
    const otpExpirationTime = moment(user.otpExpiresAt).unix();

    if (
      userVerifyDto.otp !== user.otp ||
      userVerifyDto.otp.toString().length !== 6
    ) {
      throw new BadRequestException('Invalid OTP.');
    }

    if (currTime > otpExpirationTime) {
      throw new BadRequestException('OTP expired.');
    }

    //update database
    const update = await this.userRepository.update(user.id, {
      otpVerifiedAt: moment().toDate(),
      updatedAt: moment().toDate(),
    });
    return [user, update];
  }
}
