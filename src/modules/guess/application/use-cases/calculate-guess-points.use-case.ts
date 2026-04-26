import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type { CalculateGuessPointsInput } from '@src/modules/guess/application/dto/input/calculate-guess-points.input';
import type { CalculateGuessPointsUseCaseInterface } from '@src/modules/guess/application/contracts/use-cases/calculate-guess-points.use-case.interface';
import type { GuessOutput } from '@src/modules/guess/application/dto/output/guess.output';
import { GUESS_REPOSITORY_INTERFACE } from '@src/modules/guess/application/contracts/tokens/guess.tokens';
import type { GuessRepositoryInterface } from '@src/modules/guess/application/contracts/repositories/guess.repository.interface';
import { GuessOutputMapper } from '@src/modules/guess/application/mappers/guess-output.mapper';
import { calculateGuessPoints } from '@src/modules/guess/application/helpers/calculate-guess-points.helper';

import { MATCH_REPOSITORY_INTERFACE } from '@src/modules/match/application/contracts/tokens/match.tokens';
import type { MatchRepositoryInterface } from '@src/modules/match/application/contracts/repositories/match.repository.interface';
import { MatchStatus } from '@src/modules/match/domain/enums/match-status.enum';

@Injectable()
export class CalculateGuessPointsUseCase implements CalculateGuessPointsUseCaseInterface {
  constructor(
    @Inject(GUESS_REPOSITORY_INTERFACE)
    private readonly guessRepository: GuessRepositoryInterface,
    @Inject(MATCH_REPOSITORY_INTERFACE)
    private readonly matchRepository: MatchRepositoryInterface,
  ) {}

  async execute(input: CalculateGuessPointsInput): Promise<GuessOutput[]> {
    const match = await this.matchRepository.read(input.matchId);

    if (!match) {
      throw new NotFoundException('Match not found!');
    }

    if (match.status !== MatchStatus.FINISHED) {
      throw new BadRequestException(
        'Guess points can only be calculated for finished matches',
      );
    }

    if (
      match.homeTeamScore === null ||
      match.homeTeamScore === undefined ||
      match.awayTeamScore === null ||
      match.awayTeamScore === undefined
    ) {
      throw new BadRequestException(
        'Match score is required to calculate points',
      );
    }

    const homeTeamScore = match.homeTeamScore;
    const awayTeamScore = match.awayTeamScore;

    const guesses = await this.guessRepository.listByMatch(input.matchId);

    const updatedGuesses = await Promise.all(
      guesses.map((guess) => {
        const pointsEarned = calculateGuessPoints({
          guessedHomeScore: guess.guessedHomeScore,
          guessedAwayScore: guess.guessedAwayScore,
          homeTeamScore,
          awayTeamScore,
        });

        return this.guessRepository.updatePoints({
          guessId: guess._id,
          pointsEarned,
        });
      }),
    );

    return GuessOutputMapper.toOutputList(
      updatedGuesses.filter(
        (guess): guess is NonNullable<typeof guess> => guess !== null,
      ),
    );
  }
}
