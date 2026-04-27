export class RankingResponse {
  userId!: string;
  name!: string;
  alias?: string;
  totalPoints!: number;
  totalGuesses!: number;
  position!: number;
}
