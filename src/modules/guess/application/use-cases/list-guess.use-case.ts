import { Inject, Injectable } from '@nestjs/common';

import { GUESS_REPOSITORY_INTERFACE } from '@src/modules/guess/application/contracts/tokens/guess.tokens';
import type { GuessRepositoryInterface } from '@src/modules/guess/application/contracts/repositories/guess.repository.interface';
import type { ListGuessUseCaseInterface } from '@src/modules/guess/application/contracts/use-cases/list-guess.use-case.interface';
import type { GuessOutput } from '@src/modules/guess/application/dto/output/guess.output';
import { GuessOutputMapper } from '@src/modules/guess/application/mappers/guess-output.mapper';

@Injectable()
export class ListGuessUseCase implements ListGuessUseCaseInterface {
  constructor(
    @Inject(GUESS_REPOSITORY_INTERFACE)
    private readonly guessRepository: GuessRepositoryInterface,
  ) {}

  async execute(): Promise<GuessOutput[]> {
    const guesses = await this.guessRepository.list();

    return GuessOutputMapper.toOutputList(guesses);
  }
}
