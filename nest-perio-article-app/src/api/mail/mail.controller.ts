import { Body, Controller, HttpStatus, Post, UseFilters } from '@nestjs/common';
import { MailService } from './mail.service';
import { HttpExceptionFilter } from 'src/comman/middlewares/exception.filer';
import { MailDto } from './dto/mail.dto';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';

@Controller('mail')
@UseFilters(HttpExceptionFilter)
@ApiTags('send mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/send')
  @UseFilters(HttpExceptionFilter)
  @ApiOperation({ summary: 'Send mail' })
  @ApiBody({ type: MailDto })
  async sendMail(@Body() mailDto: MailDto) {
    await this.mailService.sendMail(
      mailDto.email,
      'test email',
      'this is a test email.',
    );
    return {
      status: HttpStatus.CREATED,
      message: `Email send successfully to ${mailDto.email}`,
    };
  }
}
