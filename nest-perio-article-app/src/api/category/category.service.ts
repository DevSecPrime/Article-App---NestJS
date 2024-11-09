import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/api/category/entity/category.entity';
import { Repository } from 'typeorm';
import { CategoryDto } from './dto/category.dtos';

@Injectable()
// @UseFilters(HttpExceptionFilter)
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Find by category name
   * @param name string
   * @returns
   */
  async findByCategoryName(name: string): Promise<any> {
    const category = await this.categoryRepository.findOne({
      where: { name },
    });
    if (category) {
      throw new BadRequestException('Category name already exists.');
    }
    return category;
  }

  /**
   * Create new category
   * @param categoryDto object
   * @returns
   */
  async createNewCategory(categoryDto: CategoryDto): Promise<Category> {
    //get category name
    await this.findByCategoryName(categoryDto.name);
    //create new category
    return await this.categoryRepository.save(
      this.categoryRepository.create(categoryDto),
    );
  }

  /**
   * Find category by id
   * @param id number
   * @returns
   */
  async findById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }
    return category;
  }

  /**
   * Check categiry by name
   * @param categoryName string
   * @param id number
   * @returns
   */
  async checkCategory(name: string, id: number): Promise<any> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .where('LOWER(category.name) = :name', { name })
      .andWhere('category.id != :id', { id })
      .getOne();
    if (category) {
      throw new BadRequestException('Category is already used by other.');
    }
    return category;
  }

  /**
   * Update category
   * @param id number
   * @param categoryDto Object
   * @returns
   */
  async updateCategory(
    id: number,
    categoryDto: CategoryDto,
  ): Promise<Category> {
    //check if category id is correct
    await this.findById(id);
    //check if category name is used in other categories
    await this.checkCategory(categoryDto.name, id);
    await this.categoryRepository.update(id, categoryDto);
    return await this.categoryRepository.findOne({ where: { id } });
  }
  /**
   * Delete category
   * @param id number
   * @returns
   */
  async delete(id: number): Promise<any> {
    //check if category is not exist
    await this.findById(id);
    //delete the category
    return await this.categoryRepository.delete(id);
  }
  /**
   * Find all category
   * @param search string
   * @param page number
   * @param limit number
   * @returns
   */
  async findAllCategories(
    search: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const skip = (page - 1) * limit; //to skip the page
    search = String(search).trim().toLowerCase(); ///converted the search value in lower case
    const queryBuilder = this.categoryRepository.createQueryBuilder('category');
    // Apply search filter if provided
    if (
      search &&
      search !== '' &&
      search !== 'undefined' &&
      search !== 'null'
    ) {
      queryBuilder.andWhere('LOWER(category.name) LIKE :search', {
        search: `%${search.toString().toLowerCase()}%`,
      });
    }
    const total = await queryBuilder.getCount();

    const data = limit
      ? await queryBuilder.take(limit).skip(skip).getMany()
      : await queryBuilder.getMany();
    return [data, total];
  }
}
