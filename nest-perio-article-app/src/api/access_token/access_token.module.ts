import { Module } from '@nestjs/common';
import { AccessTokenService } from './access_token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessToken } from './entity/accessToken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccessToken])],
  controllers: [],
  providers: [AccessTokenService],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
