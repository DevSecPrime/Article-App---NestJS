import { Expose, Transform } from 'class-transformer';
import * as moment from 'moment';
import { Article } from 'src/api/articles/entity/article.entity';
import { User } from 'src/api/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Favourites {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Article, (articles) => articles.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Expose()
  articles: Article;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Transform(({ value }) => moment(value).unix())
  @Expose()
  updatedAt: Date;
}
