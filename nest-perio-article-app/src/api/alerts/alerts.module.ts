import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alerts } from './entity/alerts.entity';
import { AccessTokenModule } from '../access_token/access_token.module';
import { JwtStrategy } from 'src/passport/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Alerts]), UsersModule, AccessTokenModule],
  providers: [AlertsService, JwtStrategy],
  controllers: [AlertsController],
  exports: [AlertsService],
})
export class AlertsModule {}
