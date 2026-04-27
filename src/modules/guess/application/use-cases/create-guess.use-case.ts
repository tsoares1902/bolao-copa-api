import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type { CreateGuessInput } from '@src/modules/guess/application/dto/input/create-guess.input';
import type { CreateGuessUseCaseInterface } from '@src/modules/guess/application/contracts/use-cases/create-guess.use-case.interface';
import type { GuessOutput } from '@src/modules/guess/application/dto/output/guess.output';
import type { GuessRepositoryInterface } from '@src/modules/guess/application/contracts/repositories/guess.repository.interface';
import { GUESS_REPOSITORY_INTERFACE } from '@src/modules/guess/application/contracts/tokens/guess.tokens';
import { GuessOutputMapper } from '@src/modules/guess/application/mappers/guess-output.mapper';
import { validateMatchNotStarted } from '@src/modules/guess/application/helpers/validate-match-not-started.helper';
import { USER_REPOSITORY_INTERFACE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { UserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/user.repository.interface';
import { MATCH_REPOSITORY_INTERFACE } from '@src/modules/match/application/contracts/tokens/match.tokens';
import type { MatchRepositoryInterface } from '@src/modules/match/application/contracts/repositories/match.repository.interface';

@Injectable()
export class CreateGuessUseCase implements CreateGuessUseCaseInterface {
  constructor(
    @Inject(GUESS_REPOSITORY_INTERFACE)
    private readonly guessRepository: GuessRepositoryInterface,
    @Inject(USER_REPOSITORY_INTERFACE)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(MATCH_REPOSITORY_INTERFACE)
    private readonly matchRepository: MatchRepositoryInterface,
  ) {}

  async execute(input: CreateGuessInput): Promise<GuessOutput> {
    if (input.guessedHomeScore < 0 || input.guessedAwayScore < 0) {
      throw new BadRequestException(
        'Scores must be greater than or equal to 0',
      );
    }

    const user = await this.userRepository.read(input.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const match = await this.matchRepository.read(input.matchId);

    if (!match) {
      throw new NotFoundException('Match not found!');
    }

    validateMatchNotStarted(match);

    const existingGuess = await this.guessRepository.findByUserAndMatch({
      userId: input.userId,
      matchId: input.matchId,
    });

    if (existingGuess) {
      throw new ConflictException('Guess already exists for this match!');
    }

    const guess = await this.guessRepository.create(input);

    return GuessOutputMapper.toOutput(guess);
  }
}
