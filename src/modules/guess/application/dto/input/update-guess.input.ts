export class UpdateGuessInput {
  guessId!: string;
  userId!: string;
  guessedHomeScore?: number;
  guessedAwayScore?: number;
}
