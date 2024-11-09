import { Module } from '@nestjs/common';
import { RefreshTokensService } from './refresh_tokens.service';
import { RefreshToken } from './entity/refresh_token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  providers: [RefreshTokensService],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
