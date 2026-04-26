import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { CREATE_GUESS_USE_CASE_INTERFACE } from '@src/modules/guess/application/contracts/tokens/guess.tokens';
import type { CreateGuessUseCaseInterface } from '@src/modules/guess/application/contracts/use-cases/create-guess.use-case.interface';
import { CreateGuessRequest } from '@src/modules/guess/adapters/http/dto/request/create-guess.request';
import { GuessResponse } from '@src/modules/guess/adapters/http/dto/response/guess.response';
import { GuessMapper } from '@src/modules/guess/adapters/http/mappers/guess.mapper';
import { AccessTokenGuard } from '@src/modules/auth/adapters/http/guards/access-token.guard';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    phone?: string;
  };
};

@ApiTags('Guess')
@Controller('guess')
export class CreateGuessController {
  constructor(
    @Inject(CREATE_GUESS_USE_CASE_INTERFACE)
    private readonly createGuessUseCase: CreateGuessUseCaseInterface,
  ) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async handle(
    @Req() request: AuthenticatedRequest,
    @Body() body: CreateGuessRequest,
  ): Promise<GuessResponse> {
    const output = await this.createGuessUseCase.execute({
      userId: request.user.userId,
      matchId: body.matchId,
      guessedHomeScore: body.guessedHomeScore,
      guessedAwayScore: body.guessedAwayScore,
    });

    return GuessMapper.toResponse(output);
  }
}
