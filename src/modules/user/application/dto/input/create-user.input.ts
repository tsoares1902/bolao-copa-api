import {
  MediaEntity,
  PhoneEntity,
} from '@src/modules/user/domain/entities/user.entity';

export class CreateUserInput {
  name!: string;
  alias?: string;
  password!: string;
  phone!: PhoneEntity;
  media?: MediaEntity;
  isActive?: boolean;
}
