import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entity/article.entity';
import { ArticleController } from './articles.controller';
import { ArticleService } from './articles.service';
import { CategoryModule } from '../category/category.module';
import { Category } from '../category/entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category]), CategoryModule],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
