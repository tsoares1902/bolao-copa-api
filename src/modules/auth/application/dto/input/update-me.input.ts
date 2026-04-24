import {
  MediaEntity,
  PhoneEntity,
} from '@src/modules/user/domain/entities/user.entity';

export class UpdateMeInput {
  userId!: string;
  name?: string;
  alias?: string;
  phone?: Partial<PhoneEntity>;
  media?: Partial<MediaEntity>;
}
