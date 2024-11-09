import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/api/category/entity/category.entity';
import { Article } from '../articles/entity/article.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Category, Article])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
