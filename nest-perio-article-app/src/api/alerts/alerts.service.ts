import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alerts } from './entity/alerts.entity';
import { Repository } from 'typeorm';
import { AlertDto } from './dto/alert.dto';
import { DayOfWeek } from 'src/comman/constants';
import { ConflictExceptiion } from 'src/comman/exceptions/conflict.exception';
import * as moment from 'moment';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alerts)
    private readonly alertRepositoy: Repository<Alerts>,
  ) {}
  /**
   * Chek if user already having an alert on paricluar day
   * @param userId number
   * @param day enum
   * @returns
   */
  async chekAlert(userId: number, day: string): Promise<any> {
    return await this.alertRepositoy.findOne({
      where: {
        user: { id: userId },
        day,
      },
    });
  }
  /**
   *  Set alert
   * @param userId number
   * @param alertDto object
   * @returns
   */
  async setAlert(userId: number, alertDto: AlertDto): Promise<Alerts> {
    console.log('user id', userId);
    console.log('Alert Dto:', alertDto);
    //check if day is valid
    const day = alertDto.day.toLowerCase();
    const dayOfTheWeek = Object.values(DayOfWeek).includes(day as DayOfWeek);
    if (!dayOfTheWeek) {
      throw new ConflictExceptiion('Invalid day');
    }
    //check if day is already having alert
    const chekAlert = await this.chekAlert(userId, alertDto.day);
    if (chekAlert) {
      throw new BadRequestException('You are already having alert.');
    }
    //set time base
    const currentTime = moment().format('YYYY-MM-DD');
    const alertTime = moment(`${currentTime} ${alertDto.time}`).toDate();

    console.log('alert time: ' + alertTime);
    //save alert in databse
    return await this.alertRepositoy.save(
      this.alertRepositoy.create({
        day: alertDto.day,
        time: alertTime,
        user: { id: userId },
      }),
    );
  }

  /**
   * Update alert
   * @param userId number
   * @param alertDto object
   * @param alertId number
   * @returns
   */
  async updateAlertTime(
    userId: number,
    alertDto: AlertDto,
    alertId: number,
  ): Promise<Alerts> {
    //check if alert not found
    const alert = await this.alertRepositoy.findOneBy({ id: alertId });
    if (!alert) {
      throw new NotFoundException('Alert does not exist');
    }
    //check if day is valid
    const day = alertDto.day.toLowerCase();
    const dayOfTheWeek = Object.values(DayOfWeek).includes(day as DayOfWeek);
    if (!dayOfTheWeek) {
      throw new ConflictExceptiion('Invalid day');
    }

    //set time base
    const currentTime = moment().format('YYYY-MM-DD');
    const alertTime = moment(`${currentTime} ${alertDto.time}`).toDate();

    console.log('alert time: ' + alertTime);
    await this.alertRepositoy.update(alertId, {
      day: alertDto.day,
      time: alertTime,
      user: { id: userId },
    });
    return alert;
  }

  /**
   * Get alert message
   * @param userId
   * @returns
   */
  async getAlert(userId: number): Promise<Alerts> {
    console.log('user Id', userId);
    // Check if user exists
    const user = await this.alertRepositoy
      .createQueryBuilder('alerts')
      .where({ user: { id: userId } })
      .getOne();

    if (!user) {
      throw new NotFoundException('Invalid user');
    }

    // Get days of the week from the enum
    const daysOfTheWeek = Object.values(DayOfWeek);
    console.log('Days of the week:', daysOfTheWeek);

    // Get index of the current day (0 = Sunday)
    const currentDayIndex = moment().day();
    console.log('Current day index: ' + currentDayIndex);

    //get current day
    const today = daysOfTheWeek[currentDayIndex - 1];
    console.log('Today is: ', today);

    // Get current time
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

    console.log('Current time: ', currentTime);

    // Check if today and time are equal to the time of alert
    const alert = await this.alertRepositoy
      .createQueryBuilder('alerts')
      .where('alerts.userId = :userId', { userId }) // Corrected to alerts.userId
      .andWhere('alerts.day = :today', { today })
      .getOne();

    if (!alert) {
      throw new NotFoundException('No alert found for today.');
    }
    console.log('Alert data:', alert);

    const alertTime = moment(alert.time).format('YYYY-MM-DD HH:mm:ss');
    console.log('Formmatted time is', alertTime);

    if (alertTime.toString() == currentTime && alert.day === today) {
      console.log('in side time', alertTime.toString());
      console.log('current time is', currentTime);
      console.log('ins side day', alert.day);
      // If yes, then update a message in alert that "It's time to read an article"
      await this.alertRepositoy.update(alert.id, {
        message: 'Alert is on',
      });
    } else {
      // Else pass error
      throw new ConflictException("It's not time to read an article");
    }

    return alert;
  }
}
