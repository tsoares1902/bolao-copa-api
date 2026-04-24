import type { MatchEntity } from '@src/modules/match/domain/entities/match.entity';
import type { MatchOutput } from '@src/modules/match/application/dto/output/match.output';

export class MatchOutputMapper {
  static toOutput(match: MatchEntity): MatchOutput {
    return {
      _id: match._id,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      stadiumId: match.stadiumId,
      matchDate: match.matchDate,
      phase: match.phase,
      groupName: match.groupName,
      homeTeamScore: match.homeTeamScore,
      awayTeamScore: match.awayTeamScore,
      status: match.status,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
    };
  }

  static toOutputList(matches: MatchEntity[]): MatchOutput[] {
    return matches.map((match) => this.toOutput(match));
  }
}
