import { IsInt, IsMongoId, IsNotEmpty, Min } from 'class-validator';

export class CreateGuessRequest {
  @IsMongoId()
  @IsNotEmpty()
  matchId!: string;

  @IsInt()
  @Min(0)
  guessedHomeScore!: number;

  @IsInt()
  @Min(0)
  guessedAwayScore!: number;
}
