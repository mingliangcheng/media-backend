import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'node:process';
import { ResTransformInterceptor } from '../interceptor/res-transform.interceptor';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from '../filter/http-exception.filter';
import { AnyExceptionFilter } from '../filter/any-exception.filter';
import { User } from '../modules/user/entities/user.entity';
import { Profile } from '../modules/user/entities/profile.entity';
import { Photo } from '../modules/user/entities/photo.entity';
import { RedisModule } from './redis/redis.module';
import { ShareService } from './share.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env['NODE_ENV']}`],
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: configService.get<any>('MYSQL_TYPE'),
        host: configService.get<string>('MYSQL_HOST'),
        port: configService.get<number>('MYSQL_PORT'),
        username: configService.get<string>('MYSQL_USERNAME'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        autoLoadEntities: true,
        synchronize: process.env['NODE_ENV'] === 'development',
        logging: true,
        entities: [User, Profile, Photo],
        timezone: '+08:00',
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    RedisModule,
  ],
  providers: [
    // 响应拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: ResTransformInterceptor,
    },
    // 异常过滤器
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AnyExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ShareService,
    ConfigService,
    JwtService,
  ],
  exports: [ShareService],
})
export class ShareModule {}
