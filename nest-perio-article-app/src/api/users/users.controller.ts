import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { User } from './entity/user.entity';
import { VerifyDto } from './dto/verify.dto';
import {
  GET_RESPONSE_SUCCESS,
  POST_REQUEST_SUCCESS,
  CONFLICT_RESPONSE,
  UNAUTHORIZE_RESPONSE,
  BAD_REQUEST_RESPONSE,
} from 'src/comman/swagger.response';
@Controller('api/v1/user')
@ApiTags('User')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  @ApiBody({ type: UserDto })
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(CONFLICT_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async register(@Body() userDto: UserDto) {
    //craete new user
    const [user, token] = await this.userService.createUser(userDto);
    const [accessToken, refreshToken] = token;

    //transform the user
    const transform = plainToInstance(User, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
    //return response
    return {
      status: HttpStatus.CREATED,
      data: {
        transform,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      message: 'User registered successfully.',
    };
  }

  @Post('/verify')
  @UsePipes(ValidationPipe)
  @ApiBody({ type: VerifyDto })
  @ApiOperation({ summary: 'Verify user' })
  @ApiResponse(GET_RESPONSE_SUCCESS)
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(CONFLICT_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async verifyUser(@Body() verifyDto: VerifyDto) {
    //verify user
    const [user] = await this.userService.verifyUser(verifyDto);

    //send response
    return {
      status: HttpStatus.OK,
      data: plainToInstance(User, user, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
      message: 'User verified successfully.',
    };
  }
}
