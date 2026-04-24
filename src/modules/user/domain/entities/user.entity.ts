export class PhoneEntity {
  number!: string;
  isWhatsapp!: boolean;
}

export class MediaEntity {
  avatarUrl?: string;
}

export class UserEntity {
  _id!: string;
  name!: string;
  alias?: string;
  password!: string;
  phone!: PhoneEntity;
  media?: MediaEntity;
  isActive!: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
