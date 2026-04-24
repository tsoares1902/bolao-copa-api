import { MatchOutput } from '@src/modules/match/application/dto/output/match.output';
import { MatchResponse } from '@src/modules/match/adapters/http/dto/response/match.response';

export class MatchMapper {
  static toResponse(output: MatchOutput): MatchResponse {
    return {
      _id: output._id,
      homeTeamId: output.homeTeamId,
      awayTeamId: output.awayTeamId,
      stadiumId: output.stadiumId,
      matchDate: output.matchDate,
      phase: output.phase,
      groupName: output.groupName,
      homeTeamScore: output.homeTeamScore,
      awayTeamScore: output.awayTeamScore,
      status: output.status,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
    };
  }

  static toResponseList(outputs: MatchOutput[]): MatchResponse[] {
    return outputs.map((output) => this.toResponse(output));
  }
}
