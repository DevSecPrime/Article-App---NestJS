import {
  Controller,
  Post,
  UseFilters,
  Body,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Param,
  Put,
  Get,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { HttpExceptionFilter } from 'src/comman/middlewares/exception.filer';
import { CategoryDto } from './dto/category.dtos';
import { plainToInstance } from 'class-transformer';

import { Category } from 'src/api/category/entity/category.entity';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CATEGORY_CREATED_RESPONSE,
  CATEGORY_UPDATED_RESPONSE,
  GET_RESPONSE_SUCCESS,
  POST_REQUEST_SUCCESS,
  CONFLICT_RESPONSE,
  UNAUTHORIZE_RESPONSE,
  BAD_REQUEST_RESPONSE,
} from 'src/comman/swagger.response';

import { DEFAULT_PAGE, DEFAULT_LIMIT } from 'src/comman/constants';
@Controller('/api/v1/category')
@UseFilters(HttpExceptionFilter)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Create new cartegory
   * @param categoryDto
   * @param res
   * @param next
   * @returns
   */
  @Post('/create')
  @UsePipes(ValidationPipe)
  @ApiTags('Category')
  @ApiOperation({ summary: 'Create new category' })
  @ApiResponse(CATEGORY_CREATED_RESPONSE)
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(CONFLICT_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  @ApiBody({ type: CategoryDto })
  async createCategory(@Body() categoryDto: CategoryDto) {
    // Create new category
    // eslint-disable-next-line prettier/prettier
    const newCategory = await this.categoryService.createNewCategory(
      categoryDto,
    );
    // Transform plain object to instance
    const transformedCat = plainToInstance(Category, newCategory, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
    // Send response
    return {
      status: HttpStatus.CREATED,
      data: transformedCat,
      message: 'New category created successfully.',
    };
  }

  /**
   * Update category
   * @param id number
   * @param categoryDto object
   * @returns
   */
  @Put('/update/:id')
  @UsePipes(ValidationPipe)
  @ApiTags('Category')
  @ApiOperation({ summary: 'Update catgeory' })
  @ApiResponse(CATEGORY_UPDATED_RESPONSE)
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(CONFLICT_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  @ApiBody({ type: CategoryDto })
  async updateCategory(
    @Param('id') id: number,
    @Body() categoryDto: CategoryDto,
  ) {
    //update category
    const updateCat = await this.categoryService.updateCategory(
      id,
      categoryDto,
    );
    //tranform the data
    const transform = plainToInstance(Category, updateCat, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
    //send response
    return {
      status: HttpStatus.OK,
      data: transform,
      message: 'Category updated successfully.',
    };
  }
  /**
   * Get single category
   * @param id number
   * @returns
   */
  @Get('/:id')
  @ApiTags('Category')
  @ApiOperation({ summary: 'Get single catgeory by id' })
  @ApiResponse(GET_RESPONSE_SUCCESS)
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(CONFLICT_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async getSingleCategory(@Param('id') id: number) {
    //chek if id is correct or not
    const category = await this.categoryService.findById(id);

    //tranform the data
    const transform = plainToInstance(Category, category, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    //send response
    return {
      status: HttpStatus.OK,
      data: transform,
      message: 'Category fetched successfully.',
    };
  }

  /**
   * Delete category
   * @param id number
   * @returns
   */
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete category by id' })
  @ApiResponse(GET_RESPONSE_SUCCESS)
  @ApiTags('Category')
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(CONFLICT_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async deleteCategory(@Param('id') id: number) {
    //delete category
    await this.categoryService.delete(id);

    //send response
    return {
      status: HttpStatus.OK,
      message: 'Category deleted successfully.',
    };
  }

  /**
   * List all categories
   * @param search strin
   * @param page number
   * @param limit number
   * @returns
   */
  @Get()
  @ApiTags('Category')
  @ApiResponse(GET_RESPONSE_SUCCESS)
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(CONFLICT_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  @ApiOperation({ summary: 'List categories' })
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
  async getAllCategories(
    @Query('search') search: string,
    @Query('page') _page: number,
    @Query('limit') _limit: number,
  ): Promise<any> {
    const page = Number(_page) || DEFAULT_PAGE;
    const limit = Number(_limit) || DEFAULT_LIMIT;

    const [allCates, total] = await this.categoryService. findAllCategories(
      search,
      _page,
      _limit,
    );

    if (!allCates.length) {
      throw new NotFoundException('No categories found');
    }

    const transform = plainToInstance(Category, allCates, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
    return {
      status: HttpStatus.OK,
      data: transform,
      message: 'Categories fetched successfully.',
      meta: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    };
  }
}
