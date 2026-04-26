import { GuessOutput } from '@src/modules/guess/application/dto/output/guess.output';
import { GuessEntity } from '@src/modules/guess/domain/entities/guess.entity';

export class GuessOutputMapper {
  static toOutput(guess: GuessEntity): GuessOutput {
    return {
      _id: guess._id,
      userId: guess.userId,
      matchId: guess.matchId,
      guessedHomeScore: guess.guessedHomeScore,
      guessedAwayScore: guess.guessedAwayScore,
      pointsEarned: guess.pointsEarned,
      createdAt: guess.createdAt,
      updatedAt: guess.updatedAt,
    };
  }

  static toOutputList(guesses: GuessEntity[]): GuessOutput[] {
    return guesses.map((guess) => this.toOutput(guess));
  }
}
