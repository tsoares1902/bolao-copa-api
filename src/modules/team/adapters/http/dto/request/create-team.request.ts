import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTeamRequest {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  isoCode!: string;

  @IsString()
  @IsNotEmpty()
  flagEmoji!: string;
}
