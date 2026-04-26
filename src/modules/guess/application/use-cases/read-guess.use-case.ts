import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { ReadGuessInput } from '@src/modules/guess/application/dto/input/read-guess.input';
import type { ReadGuessUseCaseInterface } from '@src/modules/guess/application/contracts/use-cases/read-guess.use-case.interface';
import type { GuessOutput } from '@src/modules/guess/application/dto/output/guess.output';
import { GUESS_REPOSITORY_INTERFACE } from '@src/modules/guess/application/contracts/tokens/guess.tokens';
import type { GuessRepositoryInterface } from '@src/modules/guess/application/contracts/repositories/guess.repository.interface';
import { GuessOutputMapper } from '@src/modules/guess/application/mappers/guess-output.mapper';

@Injectable()
export class ReadGuessUseCase implements ReadGuessUseCaseInterface {
  constructor(
    @Inject(GUESS_REPOSITORY_INTERFACE)
    private readonly guessRepository: GuessRepositoryInterface,
  ) {}

  async execute(input: ReadGuessInput): Promise<GuessOutput> {
    const guess = await this.guessRepository.read(input.guessId);

    if (!guess) {
      throw new NotFoundException('Guess not found');
    }

    return GuessOutputMapper.toOutput(guess);
  }
}
