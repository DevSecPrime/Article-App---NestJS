import { Expose, Transform } from 'class-transformer';
import * as moment from 'moment';
import { Category } from 'src/api/category/entity/category.entity';
import { Favourites } from 'src/api/favourites/entity/favourites.entity';
import {
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
} from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @ManyToOne(() => Category, (category) => category.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Expose()
  category: Category;

  @OneToMany(() => Favourites, (favourite) => favourite.articles)
  @Expose()
  favourites: Favourites[];

  @Column({ length: 500 })
  @Expose()
  title: string;

  @Column({ length: 500 })
  @Expose()
  author: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  @Expose()
  summary: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  @Expose()
  abstract: string;

  @Column({ length: 255 })
  @Expose()
  journal: string;

  @Column({ length: 50 })
  @Expose()
  publishedYear: string;

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
}
