import { Module } from '@nestjs/common';
import { FavouritesController } from './favourites.controller';
import { FavouritesService } from './favourites.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favourites } from './entity/favourites.entity';
import { ArticleModule } from '../articles/articles.module';
import { Article } from '../articles/entity/article.entity';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from 'src/passport/jwt.strategy';
import { AccessTokenModule } from '../access_token/access_token.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favourites, Article]),
    ArticleModule,
    UsersModule,
    AccessTokenModule,
  ],
  controllers: [FavouritesController],
  providers: [FavouritesService, JwtStrategy],
  exports: [FavouritesService], // Make it available for other modules to import and use it.
})
export class FavouritesModule {}
