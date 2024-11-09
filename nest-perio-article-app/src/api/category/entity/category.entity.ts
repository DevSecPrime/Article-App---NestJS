import { Expose, Transform } from 'class-transformer';
import * as moment from 'moment';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Article } from 'src/api/articles/entity/article.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column({ length: 500 })
  @Expose()
  name: string;

  @Column({ length: 7 })
  @Expose()
  color: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Expose()
  @Transform(({ value }) => moment(value).unix())
  updatedAt: Date;

  @OneToMany(() => Article, (article) => article.category)
  articles: Article[];
}
