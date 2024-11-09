/* eslint-disable prettier/prettier */
import {
  Controller,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  Req,
  Query,
  Get,
} from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { Request } from 'express';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';
import { AuthRevocationGuard } from 'src/comman/middlewares/auth-middleware';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from 'src/comman/constants';
import { plainToInstance } from 'class-transformer';
import { Favourites } from './entity/favourites.entity';
import {
  POST_REQUEST_SUCCESS,
  BAD_REQUEST_RESPONSE,
  UNAUTHORIZE_RESPONSE,
  CONFLICT_RESPONSE,
} from 'src/comman/swagger.response';
export interface AuthRequest extends Request {
  user: {
    id: number;
  };
}
@Controller('api/v1/favourites')
@ApiTags('favourites')
export class FavouritesController {
  constructor(private readonly favoritesService: FavouritesService) {}

  /**
   * like the article
   * @param req
   * @param id
   * @returns
   */
  @Post('like/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AuthRevocationGuard)
  @ApiOperation({ summary: 'Like article' })
  @ApiBearerAuth() // This will add the Bearer token input field in Swagger UI
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the article to like',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Article liked successfully.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: HttpStatus.CREATED },
        message: { type: 'string', example: 'Article liked successfully.' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized request. Bearer token is missing or invalid.',
  })
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(CONFLICT_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async addLike(@Req() req: AuthRequest, @Param('id') id: number) {
    // Add like
    await this.favoritesService.addLike(id, req.user.id);

    // Send response
    return {
      status: HttpStatus.CREATED,
      message: 'Article liked successfully.',
    };
  }

  /**
   * Dislike the article
   * @param req
   * @param id
   * @returns
   */
  @Post('remove/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AuthRevocationGuard)
  @ApiOperation({ summary: 'Dislike article' })
  @ApiBearerAuth() // This will add the Bearer token input field in Swagger UI
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the article to like',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Article Disliked successfully.',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: HttpStatus.CREATED },
        message: { type: 'string', example: 'Article liked successfully.' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized request. Bearer token is missing or invalid.',
  })
  async removeLike(@Req() req: AuthRequest, @Param('id') id: number) {
    // Add like
    await this.favoritesService.removeLike(id, req.user.id);

    // Send response
    return {
      status: HttpStatus.CREATED,
      message: 'Like removed successfully.',
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AuthRevocationGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all user liked articles' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
  })
  async getLikedArticles(
    @Req() req: AuthRequest,
    @Query('page') _page: number,
    @Query('limit') _limit: number,
  ) {
    const page = Number(_page) || DEFAULT_PAGE;
    const limit = Number(_limit) || DEFAULT_LIMIT;

    const [
      allLikedArticles,
      total,
    ] = await this.favoritesService.getAllLikedArticles(
      _page,
      _limit,
      req.user.id,
    );

    return {
      status: HttpStatus.OK,
      data: plainToInstance(Favourites, allLikedArticles, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCount: total,
      },
    };
  }
}
