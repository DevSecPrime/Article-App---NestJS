import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
  Max,
} from 'class-validator';

export class VerifyDto {
  @ApiProperty({
    description: 'Country code',
    example: '+91',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  countryCode: string;

  @ApiProperty({
    description: 'Phone Number',
    example: '9876543210',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(10000000) // Minimum 8 digits for phone number
  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  @Max(99999999999999999999) // Maximum 20 digits for phone number
  phoneNo: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(100000) // Minimum OTP value (6 digits)
  @Max(999999) // Maximum OTP value (6 digits)
  @ApiProperty({
    description: 'Enter the OTP',
    type: 'number',
    example: 123456,
    required: true,
  })
  otp: number;
}
