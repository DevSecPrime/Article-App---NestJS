import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { DayOfWeek } from 'src/comman/constants';

export class AlertDto {
  @ApiProperty({
    enum: DayOfWeek,
    description: 'Day of the week',
    required: true,
  })
  @IsNotEmpty()
  day: DayOfWeek;

  @ApiProperty({
    type: 'string',
    description: 'Time of the alert in HH:MM format',
    example: '10:00',
  })
  @IsNotEmpty()
  time: string;
}
