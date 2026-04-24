import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class PhoneRequest {
  @IsString()
  @IsOptional()
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
