import {
  MediaEntity,
  PhoneEntity,
} from '@src/modules/user/domain/entities/user.entity';

export class UpdateUserInput {
  userId!: string;
  name?: string;
  alias?: string;
  password?: string;
  phone?: Partial<PhoneEntity>;
  media?: Partial<MediaEntity>;
  isActive?: boolean;
}
