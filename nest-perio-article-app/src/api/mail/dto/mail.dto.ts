import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class MailDto {
  @ApiProperty({ description: 'Enter your email address', required: true })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
