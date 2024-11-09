import { Expose, Transform } from 'class-transformer';
import * as moment from 'moment';
import { AccessToken } from 'src/api/access_token/entity/accessToken.entity';
import { Alerts } from 'src/api/alerts/entity/alerts.entity';
import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ length: 10, nullable: false })
  @Expose()
  countryCode: string;

  @Column({ type: 'bigint', nullable: false })
  @Expose()
  phoneNo: number;

  @Column({ type: 'int', default: 0, nullable: true })
  @Expose()
  otp: number;

  @Column({ type: 'timestamp', nullable: true })
  otpVerifiedAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  otpExpiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Expose()
  @Transform(({ value }) => moment(value).unix())
  updatedAt: Date;

  //One-to-many relationship that user is havibg the multiple tokens ---- relations
  @OneToMany(() => AccessToken, (accessToken) => accessToken.user)
  accessTokens: AccessToken[];

  //One-to-Many relationship bcz one user cxan have multiple alerts
  @OneToMany(() => Alerts, (alert) => alert.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  alerts: Alerts[];
}
