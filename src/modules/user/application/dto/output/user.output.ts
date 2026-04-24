import {
  MediaEntity,
  PhoneEntity,
} from '@src/modules/user/domain/entities/user.entity';

export class UserOutput {
  _id!: string;
  name!: string;
  alias?: string;
  phone!: PhoneEntity;
  media?: MediaEntity;
  isActive!: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
