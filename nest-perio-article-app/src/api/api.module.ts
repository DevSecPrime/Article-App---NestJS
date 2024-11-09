import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ArticleModule } from './articles/articles.module';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { UsersModule } from './users/users.module';
import { AccessTokenModule } from './access_token/access_token.module';
import { RefreshTokensModule } from './refresh_tokens/refresh_tokens.module';
import { FavouritesModule } from './favourites/favourites.module';
import { AlertsModule } from './alerts/alerts.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    CategoryModule,
    ArticleModule,
    UsersModule,
    AccessTokenModule,
    RefreshTokensModule,
    FavouritesModule,
    AlertsModule,
    MailModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
