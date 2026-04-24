import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class PhoneRequest {
  @IsString()
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
