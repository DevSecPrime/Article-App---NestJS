import { Controller, Get, Render, UseFilters } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/comman/middlewares/exception.filer';

@Controller('/api')
@UseFilters(HttpExceptionFilter)
export class ApiController {
  @Get('changelogs')
  @ApiExcludeEndpoint()
  @Render('api/api-changelogs')
  async apiChangeLogs() {
    return { message: 'api-changelogs' };
  }
}
