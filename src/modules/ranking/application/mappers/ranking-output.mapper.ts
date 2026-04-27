import { RankingOutput } from '@src/modules/ranking/application/dto/output/ranking.output';
import { RankingEntity } from '@src/modules/ranking/domain/entities/ranking.entity';

export class RankingOutputMapper {
  static toOutput(ranking: RankingEntity): RankingOutput {
    return {
      userId: ranking.userId,
      name: ranking.name,
      alias: ranking.alias,
      totalPoints: ranking.totalPoints,
      totalGuesses: ranking.totalGuesses,
      position: ranking.position,
    };
  }

  static toOutputList(rankings: RankingEntity[]): RankingOutput[] {
    return rankings.map((ranking) => this.toOutput(ranking));
  }
}
