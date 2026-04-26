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
  @Matches(BRAZIL_PHONE_REGEX, {
    message: BRAZIL_PHONE_VALIDATION_MESSAGE,
  })
  number!: string;

  @IsBoolean()
  isWhatsapp!: boolean;
}

class MidiaRequest {
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}

export class UpdateMeRequest {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  alias?: string;

  @ValidateNested()
  @Type(() => PhoneRequest)
  @IsOptional()
  phone?: PhoneRequest;

  @ValidateNested()
  @Type(() => MidiaRequest)
  @IsOptional()
  midia?: MidiaRequest;
}
