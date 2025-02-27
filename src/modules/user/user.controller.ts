import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { RedisService } from '../../share/redis/redis.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll(@Query('id') id: number) {
    return await this.userService.findUserById(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.redisService.setKey('userId', id);
  }

  @Post('/photo')
  async createPhoto(@Body() createPhotoDto: CreatePhotoDto) {
    return await this.userService.insertPhoto(createPhotoDto);
  }
}
