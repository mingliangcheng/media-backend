import { Module } from '@nestjs/common';
import { ShareModule } from './share/share.module';
import { UserModule } from './modules/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TestService } from './task/test.service';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [ShareModule, UserModule, ScheduleModule.forRoot(), AuthModule],
  controllers: [],
  providers: [TestService],
})
export class AppModule {}
