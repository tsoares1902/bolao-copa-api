import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { MidiaRequest } from '@src/modules/stadium/adapters/http/dto/request/midia.request';

export class UpdateStadiumRequest {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  capacity?: number;

  @ValidateNested()
  @Type(() => MidiaRequest)
  @IsOptional()
  midia?: MidiaRequest;
}
