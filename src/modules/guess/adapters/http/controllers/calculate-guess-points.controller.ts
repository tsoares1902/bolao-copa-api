import { ApiTags } from '@nestjs/swagger';
import { Controller, Inject, Param, Post, UseGuards } from '@nestjs/common';

import { CALCULATE_GUESS_POINTS_USE_CASE_INTERFACE } from '@src/modules/guess/application/contracts/tokens/guess.tokens';
import type { CalculateGuessPointsUseCaseInterface } from '@src/modules/guess/application/contracts/use-cases/calculate-guess-points.use-case.interface';
import { GuessResponse } from '@src/modules/guess/adapters/http/dto/response/guess.response';
import { GuessMapper } from '@src/modules/guess/adapters/http/mappers/guess.mapper';
import { AccessTokenGuard } from '@src/modules/auth/adapters/http/guards/access-token.guard';

@ApiTags('Guess')
@Controller('guess')
export class CalculateGuessPointsController {
  constructor(
    @Inject(CALCULATE_GUESS_POINTS_USE_CASE_INTERFACE)
    private readonly calculateGuessPointsUseCase: CalculateGuessPointsUseCaseInterface,
  ) {}

  @Post('calculate-points/:matchId')
  @UseGuards(AccessTokenGuard)
  async handle(@Param('matchId') matchId: string): Promise<GuessResponse[]> {
    const output = await this.calculateGuessPointsUseCase.execute({
      matchId,
    });

    return GuessMapper.toResponseList(output);
  }
}
