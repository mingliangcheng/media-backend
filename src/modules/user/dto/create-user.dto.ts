import { Profile } from '../entities/profile.entity';
import { Photo } from '../entities/photo.entity';

export class CreateUserDto {
  name: string;
  profile: Profile;
  photos: Photo[];
}
