import { Expose, Transform } from 'class-transformer';
import * as moment from 'moment';
import { User } from 'src/api/users/entity/user.entity';
import { DayOfWeek } from 'src/comman/constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Alerts {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({
    type: 'enum',
    enum: DayOfWeek,
    nullable: false,
  })
  @Expose()
  day: string;

  @Column({ type: 'datetime', nullable: false })
  @Expose()
  @Transform(({ value }) => moment(value).unix())
  time: Date;

  @Column({ length: 255, nullable: true, default: null })
  @Expose()
  message: string;

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

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
