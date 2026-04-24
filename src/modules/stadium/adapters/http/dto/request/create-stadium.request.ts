import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { MidiaRequest } from '@src/modules/stadium/adapters/http/dto/request/midia.request';

export class CreateStadiumRequest {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  capacity?: number;

  @ValidateNested()
  @Type(() => MidiaRequest)
  @IsNotEmpty()
  midia!: MidiaRequest;
}
