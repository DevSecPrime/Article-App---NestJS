import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
} from 'class-validator';

export class ArticleDto {
  @ApiProperty({
    description: 'The unique identifier of the article',
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({
    description: 'The title of the article',
    example: 'Sample Article',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  title: string;

  @ApiProperty({
    description: 'The author of the article',
    example: 'John Doe',
    required: true,
  })
  @IsNotEmpty()
  @Length(1, 500)
  @IsString()
  author: string;

  @ApiProperty({
    description: 'The summary of the article',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  summary: string;

  @ApiProperty({
    description: 'The abstract of the article',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    required: false,
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  abstract: string;

  @ApiProperty({
    description: 'The published year of the article',
    example: '2024',
    required: true,
  })
  @IsNotEmpty()
  @Length(1, 50)
  @IsString()
  publishedYear: string;

  @ApiProperty({
    description: 'The journal of the article',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    required: true,
  })
  @IsNotEmpty()
  @Length(1, 255)
  @IsString()
  journal: string;
}
