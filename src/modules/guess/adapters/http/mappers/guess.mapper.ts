import { GuessOutput } from '@src/modules/guess/application/dto/output/guess.output';
import { GuessResponse } from '@src/modules/guess/adapters/http/dto/response/guess.response';

export class GuessMapper {
  static toResponse(output: GuessOutput): GuessResponse {
    return {
      _id: output._id,
      userId: output.userId,
      matchId: output.matchId,
      guessedHomeScore: output.guessedHomeScore,
      guessedAwayScore: output.guessedAwayScore,
      pointsEarned: output.pointsEarned,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
    };
  }

  static toResponseList(outputs: GuessOutput[]): GuessResponse[] {
    return outputs.map((output) => this.toResponse(output));
  }
}
