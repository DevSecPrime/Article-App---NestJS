import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CategoryDto {
  @ApiProperty({
    description: 'The name of the category',
    example: 'Electronics',
  })
  @IsNotEmpty()
  @Length(1, 500)
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The color representing the category',
    example: '#FF0000',
    required: false,
  })
  @IsNotEmpty()
  @Length(1, 7)
  @IsString()
  @IsOptional()
  color: string;
  categoryName: any;
}
