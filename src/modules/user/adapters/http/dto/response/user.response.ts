export class PhoneResponse {
  number!: string;
  isWhatsapp!: boolean;
}

export class MediaResponse {
  avatarUrl?: string;
}

export class UserResponse {
  _id!: string;
  name!: string;
  alias?: string;
  phone!: PhoneResponse;
  media?: MediaResponse;
  isActive!: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
