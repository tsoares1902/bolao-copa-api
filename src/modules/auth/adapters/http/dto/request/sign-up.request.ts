import { Type } from 'class-transformer';
import {
  IsDefined,
  IsBoolean,
  Matches,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  BRAZIL_PHONE_REGEX,
  BRAZIL_PHONE_VALIDATION_MESSAGE,
} from '@src/shared/utils/phone-validation.utils';

class PhoneRequest {
  @IsString()
  @IsNotEmpty()
  @Matches(BRAZIL_PHONE_REGEX, {
    message: BRAZIL_PHONE_VALIDATION_MESSAGE,
  })
  number!: string;

  @IsBoolean()
  isWhatsapp!: boolean;
}

class MediaRequest {
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}

export class SignUpRequest {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  alias?: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @ValidateNested()
  @Type(() => PhoneRequest)
  @IsDefined()
  phone!: PhoneRequest;

  @ValidateNested()
  @Type(() => MediaRequest)
  @IsOptional()
  media?: MediaRequest;
}
