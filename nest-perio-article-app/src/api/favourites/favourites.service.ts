import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favourites } from './entity/favourites.entity';
import { Repository } from 'typeorm';
import { ArticleService } from '../articles/articles.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class FavouritesService {
  constructor(
    @InjectRepository(Favourites)
    private readonly favRepository: Repository<Favourites>,
    private readonly articleService: ArticleService,
    private readonly userService: UsersService,
  ) {}

  /**
   *  Check if article is already liked
   * @param id number
   * @param userId number
   * @returns
   */
  async chekByLike(id: number, userId: number): Promise<any> {
    return await this.favRepository
      .createQueryBuilder('Favourites')
      .where({ user: { id: userId } })
      .andWhere({ articles: { id: id } })
      .getOne();
  }

  /**
   *  Add a like for an article
   * @param id number
   * @param userId number
   * @returns
   *
   */
  async addLike(id: number, userId: number): Promise<any> {
    console.log('Article id', id, 'userId', userId);
    //chek if invalid user id
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    //chek if article id is correct
    const article = await this.articleService.findById(id);
    if (!article) {
      throw new NotFoundException('Article not found.');
    }
    //chek if article is already liked
    const liked = await this.chekByLike(article.id, user.id);
    if (liked) {
      throw new BadRequestException('You have already liked this article.');
    }
    //like the the artivle and store iot in databse
    return await this.favRepository.save(
      this.favRepository.create({
        user,
        articles: article,
      }),
    );
  }
  /**
   * Remove article
   * @param id number
   * @param userId number
   * @returns
   */
  async removeLike(id: number, userId: number): Promise<any> {
    console.log('liked id', id, 'userId', userId);
    //chek if invalid user id
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    //chek if article id is correct
    const article = await this.articleService.findById(id);
    if (!article) {
      throw new NotFoundException('Article not found.');
    }
    //chek if article is already liked
    const liked = await this.chekByLike(article.id, user.id);
    if (!liked) {
      throw new BadRequestException('You have already disliked this article.');
    }
    //like the the artivle and store iot in databse
    return await this.favRepository
      .createQueryBuilder('Favourites')
      .where('favourites.userId = :userId', { userId })
      .andWhere('favourites.articlesId = :id', { id })
      .delete()
      .execute();
  }

  /**
   * Get all liked articles
   * @param page number
   * @param limit number
   * @param userId
   * @returns
   */
  async getAllLikedArticles(
    page: number,
    limit: number,
    userId: number,
  ): Promise<any> {
    const skip = (page - 1) * limit;

    //chek if user exist or not
    const user = await this.favRepository
      .createQueryBuilder('Favourites')
      .where('favourites.userId = :userId', { userId })
      .getOne();
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const queryBuilder = this.favRepository
      .createQueryBuilder('favourites')
      .leftJoinAndSelect('favourites.articles', 'article')
      .where('favourites.userId = :userId', { userId });

    const total = await queryBuilder.getCount(); //get total number of liked articles
    const data = limit
      ? await queryBuilder.take(limit).skip(skip).getMany()
      : await queryBuilder.getMany();

    return [data, total];
  }
}
