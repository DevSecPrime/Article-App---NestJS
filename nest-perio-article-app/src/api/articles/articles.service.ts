import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UseFilters,
} from '@nestjs/common';
import { Article } from './entity/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleDto } from './dtos/articles.dtos';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entity/category.entity';
import { HttpExceptionFilter } from 'src/comman/middlewares/exception.filer';
@Injectable()
@UseFilters(HttpExceptionFilter)
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly categoryService: CategoryService,
  ) {}

  /**
   * Find Category
   * @param categoryId number
   * @returns
   */
  async findByCategoryId(categoryId: number): Promise<any> {
    const checkCat = await this.categoryService.findById(categoryId);
    if (!checkCat) {
      throw new NotFoundException('Category does not exist.');
    }
    return checkCat;
  }

  /**
   * Find article by title
   * @param title string
   * @returns
   */
  async findByTitle(title: string, categoryId: number): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { title, category: { id: categoryId } },
      relations: ['category'],
    });
    if (article) {
      throw new BadRequestException('Article name already exists.');
    }
    return article;
  }

  /**
   * created new article
   * @param articleDtos object
   * @returns
   */
  async createArticle(articleDto: ArticleDto): Promise<Article> {
    //check if category is invalid
    await this.findByCategoryId(articleDto.categoryId);
    //find category by id
    const category = await this.categoryRepository.findOne({
      where: {
        id: articleDto.categoryId,
      },
    });

    //check if article alredy in use
    await this.findByTitle(articleDto.title, articleDto.categoryId);

    return await this.articleRepository.save(
      this.articleRepository.create({
        ...articleDto,
        category,
      }),
    );
    //crate the artcle and assign the category
  }

  /**
   * Find article by id
   * @param articleId number
   * @returns
   */
  async findById(articleId: number): Promise<Article> {
    const check = await this.articleRepository.findOne({
      where: {
        id: articleId,
      },
    });

    if (!check) {
      throw new NotFoundException('Article not found.');
    }
    return check;
  }

  /**
   * Check if category exists in article
   * @param categoryId number
   * @returns
   */
  async getByCategoryId(categoryId: number): Promise<Article> {
    const chekCategory = await this.articleRepository
      .createQueryBuilder('article')
      .where('article.categoryId = :categoryId', { categoryId })
      .getOne();

    if (!chekCategory) {
      throw new NotFoundException('Wrong category');
    }
    return chekCategory;
  }

  /**
   * Check title for category
   * @param id number
   * @param title strong
   * @returns
   */
  async checkTitle(id: number, title: string): Promise<Article> {
    const article = await this.articleRepository
      .createQueryBuilder('article')
      .where('LOWER(article.title) = LOWER(:title)', { title })
      .andWhere('article.id != :id', { id })
      .getOne();
    if (article) {
      throw new BadRequestException(
        'Article name is already in use in other article.',
      );
    }
    return article;
  }

  /**
   * Update article
   * @param id number
   * @param articleDtos
   * @returns
   */
  async updateArticle(id: number, articleDto: ArticleDto): Promise<Article> {
    //chek if article id is valid
    await this.findById(id);

    //chek if title is used by other article
    await this.checkTitle(id, articleDto.title);

    //update the article and assign the new category
    const article = await this.articleRepository.findOne({
      where: { id },
    });
    if (!article) {
      throw new NotFoundException('Article not found.');
    }
    //find the category id before updateinfg
    const category = await this.categoryRepository.findOne({
      where: {
        id: articleDto.categoryId,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found.');
    }
    const data = {
      ...articleDto,
      category: { id: category.id },
    };
    delete data.categoryId;
    await this.articleRepository.update(id, data);

    return await this.articleRepository.findOne({
      where: { id },
    });
  }
  /**
   * Delete the article
   * @param id number
   * @returns
   */
  async deleteArticle(id: number) {
    //find if article id is valid or not
    await this.findById(id);
    //delete the article
    return await this.articleRepository.delete(id);
  }

  /**
   * Get single article
   * @param id number
   * @returns
   */
  async getSingleArticle(id: number) {
    //find by number
    await this.findById(id);
    return this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .where('article.id = :id', { id })
      .getOne();
  }

  async findAllArticles(
    search: string,
    page: number,
    limit: number,
  ): Promise<any> {
    const skip = (page - 1) * limit;
    search = String(search).trim().toLowerCase();

    // Create the query builder
    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category');

    // Add search filter if search term is provided
    if (
      search &&
      search !== '' &&
      search !== 'undefined' &&
      search !== 'null'
    ) {
      console.log('search data:', search);
      queryBuilder.andWhere('LOWER(article.title) LIKE :search', {
        search: `%${search.toString().toLowerCase()}%`,
      });
    }

    // Get the total number of records
    const total = await queryBuilder.getCount();

    // Apply pagination and get the articles
    const data = limit
      ? await queryBuilder.take(limit).skip(skip).getMany()
      : await queryBuilder.getMany();

    console.log('article data', data); // Debugging log
    return [data, total];
  }
}
