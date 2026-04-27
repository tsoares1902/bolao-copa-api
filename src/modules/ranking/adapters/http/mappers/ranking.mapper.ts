import { RankingOutput } from '@src/modules/ranking/application/dto/output/ranking.output';
import { RankingResponse } from '@src/modules/ranking/adapters/http/dto/response/ranking.response';

export class RankingMapper {
  static toResponse(output: RankingOutput): RankingResponse {
    return {
      userId: output.userId,
      name: output.name,
      alias: output.alias,
      totalPoints: output.totalPoints,
      totalGuesses: output.totalGuesses,
      position: output.position,
    };
  }

  static toResponseList(outputs: RankingOutput[]): RankingResponse[] {
    return outputs.map((output) => this.toResponse(output));
  }
}
