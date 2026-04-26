import { Inject, Injectable } from '@nestjs/common';

import type { ListMyGuessInput } from '@src/modules/guess/application/dto/input/list-my-guess.input';
import type { ListMyGuessUseCaseInterface } from '@src/modules/guess/application/contracts/use-cases/list-my-guess.use-case.interface';
import type { GuessOutput } from '@src/modules/guess/application/dto/output/guess.output';
import { GUESS_REPOSITORY_INTERFACE } from '@src/modules/guess/application/contracts/tokens/guess.tokens';
import type { GuessRepositoryInterface } from '@src/modules/guess/application/contracts/repositories/guess.repository.interface';
import { GuessOutputMapper } from '@src/modules/guess/application/mappers/guess-output.mapper';

@Injectable()
export class ListMyGuessUseCase implements ListMyGuessUseCaseInterface {
  constructor(
    @Inject(GUESS_REPOSITORY_INTERFACE)
    private readonly guessRepository: GuessRepositoryInterface,
  ) {}

  async execute(input: ListMyGuessInput): Promise<GuessOutput[]> {
    const guesses = await this.guessRepository.listByUser(input.userId);

    return GuessOutputMapper.toOutputList(guesses);
  }
}
