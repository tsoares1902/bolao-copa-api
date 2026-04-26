import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';

import { LIST_GUESS_BY_MATCH_USE_CASE_INTERFACE } from '@src/modules/guess/application/contracts/tokens/guess.tokens';
import type { ListGuessByMatchUseCaseInterface } from '@src/modules/guess/application/contracts/use-cases/list-guess-by-match.use-case.interface';
import { GuessResponse } from '@src/modules/guess/adapters/http/dto/response/guess.response';
import { GuessMapper } from '@src/modules/guess/adapters/http/mappers/guess.mapper';
import { AccessTokenGuard } from '@src/modules/auth/adapters/http/guards/access-token.guard';

@ApiTags('Guess')
@Controller('guess')
export class ListGuessByMatchController {
  constructor(
    @Inject(LIST_GUESS_BY_MATCH_USE_CASE_INTERFACE)
    private readonly listGuessByMatchUseCase: ListGuessByMatchUseCaseInterface,
  ) {}

  @Get('match/:matchId')
  @UseGuards(AccessTokenGuard)
  async handle(@Param('matchId') matchId: string): Promise<GuessResponse[]> {
    const output = await this.listGuessByMatchUseCase.execute({
      matchId,
    });

    return GuessMapper.toResponseList(output);
  }
}
