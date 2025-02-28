import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Log } from '../share/log4js';

@Injectable()
export class TestService {
  @Cron(CronExpression.EVERY_5_SECONDS, {
    name: 'testTask',
  })
  handleCron() {
    Log.info('定时任务执行');
  }
}
