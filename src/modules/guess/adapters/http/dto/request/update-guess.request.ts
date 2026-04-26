import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateGuessRequest {
  @IsInt()
  @Min(0)
  @IsOptional()
  guessedHomeScore?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  guessedAwayScore?: number;
}
