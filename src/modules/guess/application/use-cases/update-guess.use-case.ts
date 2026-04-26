import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type { UpdateGuessInput } from '@src/modules/guess/application/dto/input/update-guess.input';
import type { UpdateGuessUseCaseInterface } from '@src/modules/guess/application/contracts/use-cases/update-guess.use-case.interface';
import type { GuessOutput } from '@src/modules/guess/application/dto/output/guess.output';
import { GUESS_REPOSITORY_INTERFACE } from '@src/modules/guess/application/contracts/tokens/guess.tokens';
import type { GuessRepositoryInterface } from '@src/modules/guess/application/contracts/repositories/guess.repository.interface';
import { GuessOutputMapper } from '@src/modules/guess/application/mappers/guess-output.mapper';
import { validateMatchNotStarted } from '@src/modules/guess/application/helpers/validate-match-not-started.helper';
import { MATCH_REPOSITORY_INTERFACE } from '@src/modules/match/application/contracts/tokens/match.tokens';
import type { MatchRepositoryInterface } from '@src/modules/match/application/contracts/repositories/match.repository.interface';

@Injectable()
export class UpdateGuessUseCase implements UpdateGuessUseCaseInterface {
  constructor(
    @Inject(GUESS_REPOSITORY_INTERFACE)
    private readonly guessRepository: GuessRepositoryInterface,
    @Inject(MATCH_REPOSITORY_INTERFACE)
    private readonly matchRepository: MatchRepositoryInterface,
  ) {}

  async execute(input: UpdateGuessInput): Promise<GuessOutput> {
    if (input.guessedHomeScore !== undefined && input.guessedHomeScore < 0) {
      throw new BadRequestException(
        'Home score must be greater than or equal to 0',
      );
    }

    if (input.guessedAwayScore !== undefined && input.guessedAwayScore < 0) {
      throw new BadRequestException(
        'Away score must be greater than or equal to 0',
      );
    }

    const currentGuess = await this.guessRepository.read(input.guessId);

    if (!currentGuess) {
      throw new NotFoundException('Guess not found!');
    }

    if (currentGuess.userId !== input.userId) {
      throw new NotFoundException('Guess not found!');
    }

    const match = await this.matchRepository.read(currentGuess.matchId);

    if (!match) {
      throw new NotFoundException('Match not found!');
    }

    validateMatchNotStarted(match);

    const guess = await this.guessRepository.update(input);

    if (!guess) {
      throw new NotFoundException('Guess not found!');
    }

    return GuessOutputMapper.toOutput(guess);
  }
}
