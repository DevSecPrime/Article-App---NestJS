import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AccessTokenModule } from '../access_token/access_token.module';
import { RefreshTokensModule } from '../refresh_tokens/refresh_tokens.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AccessTokenModule,
    RefreshTokensModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
