import { Module } from '@nestjs/common';
import { ShareModule } from './share/share.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [ShareModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
