import {
  Controller,
  Body,
  Req,
  Post,
  HttpStatus,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Param,
  Get,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertDto } from './dto/alert.dto';
import { AuthRequest } from '../favourites/favourites.controller';
import { plainToInstance } from 'class-transformer';
import { Alerts } from './entity/alerts.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthRevocationGuard } from 'src/comman/middlewares/auth-middleware';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BAD_REQUEST_RESPONSE,
  CONFLICT_RESPONSE,
  POST_REQUEST_SUCCESS,
  UNAUTHORIZE_RESPONSE,
} from 'src/comman/swagger.response';

@Controller('api/v1/alerts')
@ApiTags('Alerts')
export class AlertsController {
  constructor(private readonly alertService: AlertsService) {}

  /**
   * Set alert message for reading the article
   * @param createAlertDto object
   * @param req
   * @returns
   */
  @Post('/set')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AuthRevocationGuard)
  @ApiOperation({ summary: 'Set alert' })
  @ApiBearerAuth()
  @ApiBody({ type: AlertDto })
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(CONFLICT_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async setAlert(@Body() createAlertDto: AlertDto, @Req() req: AuthRequest) {
    //creare alert
    const alert = await this.alertService.setAlert(req.user.id, createAlertDto);
    //send response
    return {
      status: HttpStatus.CREATED,
      data: plainToInstance(Alerts, alert, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
      message: 'Aleart created successfully.',
    };
  }
  @Post('/update/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AuthRevocationGuard)
  @ApiOperation({ summary: 'Update alert' })
  @ApiBearerAuth()
  @ApiBody({ type: AlertDto })
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(CONFLICT_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async updateAlert(
    @Body() createAlertDto: AlertDto,
    @Param('id') id: number,
    @Req() req: AuthRequest,
  ) {
    //update alert
    const updateAlert = await this.alertService.updateAlertTime(
      req.user.id,
      createAlertDto,
      id,
    );
    //send response
    return {
      status: HttpStatus.OK,
      data: plainToInstance(Alerts, updateAlert, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
      message: 'Alert updated successfully.',
    };
  }
  /**
   * Get alert message
   * @param req
   * @returns
   */

  @Get('/get')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AuthRevocationGuard)
  @ApiOperation({ summary: 'Get alert' })
  @ApiBearerAuth()
  @ApiResponse(POST_REQUEST_SUCCESS)
  @ApiResponse(CONFLICT_RESPONSE)
  @ApiResponse(UNAUTHORIZE_RESPONSE)
  @ApiResponse(BAD_REQUEST_RESPONSE)
  async getAlert(@Req() req: AuthRequest) {
    //creare alert
    const alert = await this.alertService.getAlert(req.user.id);
    //send response
    return {
      status: HttpStatus.CREATED,
      data: plainToInstance(Alerts, alert, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      }),
      message: 'It1s time to read the article.',
    };
  }
}
