import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { ListGuessByMatchInput } from '@src/modules/guess/application/dto/input/list-guess-by-match.input';
import type { ListGuessByMatchUseCaseInterface } from '@src/modules/guess/application/contracts/use-cases/list-guess-by-match.use-case.interface';
import type { GuessOutput } from '@src/modules/guess/application/dto/output/guess.output';
import { GUESS_REPOSITORY_INTERFACE } from '@src/modules/guess/application/contracts/tokens/guess.tokens';
import type { GuessRepositoryInterface } from '@src/modules/guess/application/contracts/repositories/guess.repository.interface';
import { GuessOutputMapper } from '@src/modules/guess/application/mappers/guess-output.mapper';
import { MATCH_REPOSITORY_INTERFACE } from '@src/modules/match/application/contracts/tokens/match.tokens';
import type { MatchRepositoryInterface } from '@src/modules/match/application/contracts/repositories/match.repository.interface';

@Injectable()
export class ListGuessByMatchUseCase implements ListGuessByMatchUseCaseInterface {
  constructor(
    @Inject(GUESS_REPOSITORY_INTERFACE)
    private readonly guessRepository: GuessRepositoryInterface,
    @Inject(MATCH_REPOSITORY_INTERFACE)
    private readonly matchRepository: MatchRepositoryInterface,
  ) {}

  async execute(input: ListGuessByMatchInput): Promise<GuessOutput[]> {
    const match = await this.matchRepository.read(input.matchId);

    if (!match) {
      throw new NotFoundException('Match not found!');
    }

    const guesses = await this.guessRepository.listByMatch(input.matchId);

    return GuessOutputMapper.toOutputList(guesses);
  }
}
