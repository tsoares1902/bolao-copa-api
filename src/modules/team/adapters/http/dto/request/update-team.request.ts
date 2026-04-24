import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateTeamRequest {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @Length(2, 2)
  isoCode?: string;

  @IsString()
  @IsOptional()
  flagEmoji?: string;
}
