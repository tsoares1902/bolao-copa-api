import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { DeleteGuessInput } from '@src/modules/guess/application/dto/input/delete-guess.input';
import type { DeleteGuessUseCaseInterface } from '@src/modules/guess/application/contracts/use-cases/delete-guess.use-case.interface';
import { GUESS_REPOSITORY_INTERFACE } from '@src/modules/guess/application/contracts/tokens/guess.tokens';
import type { GuessRepositoryInterface } from '@src/modules/guess/application/contracts/repositories/guess.repository.interface';
import { validateMatchNotStarted } from '@src/modules/guess/application/helpers/validate-match-not-started.helper';
import { MATCH_REPOSITORY_INTERFACE } from '@src/modules/match/application/contracts/tokens/match.tokens';
import type { MatchRepositoryInterface } from '@src/modules/match/application/contracts/repositories/match.repository.interface';

@Injectable()
export class DeleteGuessUseCase implements DeleteGuessUseCaseInterface {
  constructor(
    @Inject(GUESS_REPOSITORY_INTERFACE)
    private readonly guessRepository: GuessRepositoryInterface,
    @Inject(MATCH_REPOSITORY_INTERFACE)
    private readonly matchRepository: MatchRepositoryInterface,
  ) {}

  async execute(input: DeleteGuessInput): Promise<void> {
    const guess = await this.guessRepository.read(input.guessId);

    if (!guess) {
      throw new NotFoundException('Guess not found!');
    }

    if (guess.userId !== input.userId) {
      throw new NotFoundException('Guess not found!');
    }

    const match = await this.matchRepository.read(guess.matchId);

    if (!match) {
      throw new NotFoundException('Match not found!');
    }

    validateMatchNotStarted(match);

    await this.guessRepository.delete(input.guessId);
  }
}
