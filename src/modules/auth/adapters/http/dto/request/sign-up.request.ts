import { Type } from 'class-transformer';
import {
  IsDefined,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class PhoneRequest {
  @IsString()
  @IsNotEmpty()
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
