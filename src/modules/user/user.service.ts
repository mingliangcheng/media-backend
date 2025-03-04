import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { Photo } from './entities/photo.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const profile = new Profile();
    profile.name = createUserDto.profile.name;
    await this.profileRepository.save(profile);
    const user = new User();
    user.name = createUserDto.name;
    user.profile = profile;
    await this.userRepository.save(user);
    return user.id;
  }

  async findUserById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  async findOne(username: string) {
    return await this.userRepository.findOne({
      where: { name: username },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async insertPhoto(createPhotoDto: CreatePhotoDto) {
    const photo = new Photo();
    photo.name = createPhotoDto.name;
    return await this.photoRepository.save(photo);
  }
}
