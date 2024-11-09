import {
  Body,
  Controller,
  Post,
  UseFilters,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Param,
  Put,
  Delete,
  Get,
  Query,
} from '@nestjs/common';

import { ArticleService } from './articles.service';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/comman/middlewares/exception.filer';
import { ArticleDto } from './dtos/articles.dtos';
import { plainToInstance } from 'class-transformer';
import { Article } from './entity/article.entity';
import {
  ARTICLE_ALREADY_EXISTS_RESPONSE,
  CREATE_ARTICLE_SUCCESS_RESPONSE,
  UPDATE_ARTICLE_SUCCESS_RESPONSE,
  POST_REQUEST_SUCCESS,
  CONFLICT_RESPONSE,
  UNAUTHORIZE_RESPONSE,
  BAD_REQUEST_RESPONSE,
} from 'src/comman/swagger.response';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from 'src/comman/constants';
@Controller('api/v1/article')
@UseFilters(HttpExceptionFilter)
@ApiTags('Articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * Create a new article
   * @param articleDtos object
   * @param res object
   * @param next
   * @returns
   */
  @Post('/create')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Create article' })
  @ApiResponse(ARTICLE_ALREADY_EXISTS_RESPONSE)
  @ApiResponse(CREATE_ARTICLE_SUCCESS_RESPONSE)
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(CONFLICT_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async createArticle(@Body() articleDtos: ArticleDto) {
    //creae new article
    const newArticle = await this.articleService.createArticle(articleDtos);
    //tranfoerm data
    const transform = plainToInstance(Article, newArticle, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
    //send response
    return {
      status: HttpStatus.OK,
      data: transform,
      message: 'Article created successfully.',
    };
  }
  /**
   * Update Article
   * @param articleDtos object
   * @param id number
   * @param res object
   * @param next
   * @returns
   */
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Update the Article.' })
  @ApiResponse(UPDATE_ARTICLE_SUCCESS_RESPONSE)
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(CONFLICT_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async updateArticle(@Body() articleDto: ArticleDto, @Param('id') id: number) {
    //update article
    const updateArticle = await this.articleService.updateArticle(
      id,
      articleDto,
    );
    //update article
    const transform = plainToInstance(Article, updateArticle, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
    //send respinse
    return {
      status: HttpStatus.OK,
      data: transform,
      message: 'Article updated successfully.',
    };
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete the article.' })
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(CONFLICT_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async deleteArticlle(@Param('id') id: number) {
    //delete article
    await this.articleService.deleteArticle(id);
    //send response
    return {
      status: HttpStatus.OK,
      message: 'Article deleted successfully.',
    };
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get single article' })
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(CONFLICT_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async getArticle(@Param('id') id: number) {
    //get single article
    const article = await this.articleService.getSingleArticle(id);
    //transform data
    const transform = plainToInstance(Article, article, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
    //sennd
    return {
      status: HttpStatus.OK,
      data: transform,
      message: 'Article fetched successfully.',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get List of articles' })
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(CONFLICT_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for filtering categories',
  })
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
  async getAllArticles(
    @Query('search') search: string,
    @Query('page') _page: number,
    @Query('limit') _limit: number,
  ) {
    const page = Number(_page) || DEFAULT_PAGE;
    const limit = Number(_limit) || DEFAULT_LIMIT;

    const [allArticles, total] = await this.articleService.findAllArticles(
      search,
      _page,
      _limit,
    );

    //tranform the articles
    const tranform = plainToInstance(Article, allArticles, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    //send response
    return {
      status: HttpStatus.OK,
      data: tranform,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
      message: 'All articles are fetched successfully.',
    };
  }
}
