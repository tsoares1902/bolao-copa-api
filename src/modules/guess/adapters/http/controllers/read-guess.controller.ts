import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';

import { READ_GUESS_USE_CASE_INTERFACE } from '@src/modules/guess/application/contracts/tokens/guess.tokens';
import type { ReadGuessUseCaseInterface } from '@src/modules/guess/application/contracts/use-cases/read-guess.use-case.interface';
import { GuessResponse } from '@src/modules/guess/adapters/http/dto/response/guess.response';
import { GuessMapper } from '@src/modules/guess/adapters/http/mappers/guess.mapper';
import { AccessTokenGuard } from '@src/modules/auth/adapters/http/guards/access-token.guard';

@ApiTags('Guess')
@Controller('guess')
export class ReadGuessController {
  constructor(
    @Inject(READ_GUESS_USE_CASE_INTERFACE)
    private readonly readGuessUseCase: ReadGuessUseCaseInterface,
  ) {}

  @Get(':guessId')
  @UseGuards(AccessTokenGuard)
  async handle(@Param('guessId') guessId: string): Promise<GuessResponse> {
    const output = await this.readGuessUseCase.execute({
      guessId,
    });

    return GuessMapper.toResponse(output);
  }
}
