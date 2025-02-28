import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Log } from '../share/log4js';
import { ShareService } from '../share/share.service';

@Injectable()
export class TestService {
  constructor(private readonly sharedService: ShareService) {}
  @Cron(CronExpression.EVERY_5_SECONDS, {
    name: 'testTask',
    disabled: true,
  })
  handleCron() {
    Log.info('定时任务执行');
    const key = this.sharedService.aesEncrypt('陈明亮');
    Log.error(this.sharedService.aesEncrypt('陈明亮'));
    Log.error(this.sharedService.aesDecrypt(key));
  }
}
