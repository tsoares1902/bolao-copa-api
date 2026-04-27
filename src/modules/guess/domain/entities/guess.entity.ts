export class GuessEntity {
  _id!: string;
  userId!: string;
  matchId!: string;
  guessedHomeScore!: number;
  guessedAwayScore!: number;
  pointsEarned!: number;
  isCalculated!: boolean;
  calculatedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
