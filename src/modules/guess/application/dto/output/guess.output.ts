export class GuessOutput {
  _id!: string;
  userId!: string;
  matchId!: string;
  guessedHomeScore!: number;
  guessedAwayScore!: number;
  pointsEarned!: number;
  createdAt?: Date;
  updatedAt?: Date;
}
