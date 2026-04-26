import { Type } from 'class-transformer';
import {
  IsBoolean,
  Matches,
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
  @IsOptional()
  @Matches(BRAZIL_PHONE_REGEX, {
    message: BRAZIL_PHONE_VALIDATION_MESSAGE,
  })
  number?: string;

  @IsBoolean()
  @IsOptional()
  isWhatsapp?: boolean;
}

class MediaRequest {
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}

export class UpdateUserRequest {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  alias?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @ValidateNested()
  @Type(() => PhoneRequest)
  @IsOptional()
  phone?: PhoneRequest;

  @ValidateNested()
  @Type(() => MediaRequest)
  @IsOptional()
  media?: MediaRequest;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
