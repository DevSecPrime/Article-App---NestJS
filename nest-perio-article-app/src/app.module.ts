import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import { RefreshTokensModule } from './api/refresh_tokens/refresh_tokens.module';
import { MailModule } from './api/mail/mail.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ormconfig = require('../ormconfig.js');

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ApiModule,
    RefreshTokensModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
