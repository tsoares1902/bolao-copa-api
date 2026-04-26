type CalculateGuessPointsParams = {
  guessedHomeScore: number;
  guessedAwayScore: number;
  homeTeamScore: number;
  awayTeamScore: number;
};

export function calculateGuessPoints({
  guessedHomeScore,
  guessedAwayScore,
  homeTeamScore,
  awayTeamScore,
}: CalculateGuessPointsParams): number {
  const exactScore =
    guessedHomeScore === homeTeamScore && guessedAwayScore === awayTeamScore;

  if (exactScore) {
    return 10;
  }

  const guessedResult = Math.sign(guessedHomeScore - guessedAwayScore);
  const realResult = Math.sign(homeTeamScore - awayTeamScore);

  if (guessedResult === realResult) {
    return 5;
  }

  return 0;
}
