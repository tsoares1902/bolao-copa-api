import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { UPDATE_GUESS_USE_CASE_INTERFACE } from '@src/modules/guess/application/contracts/tokens/guess.tokens';
import type { UpdateGuessUseCaseInterface } from '@src/modules/guess/application/contracts/use-cases/update-guess.use-case.interface';
import { UpdateGuessRequest } from '@src/modules/guess/adapters/http/dto/request/update-guess.request';
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
export class UpdateGuessController {
  constructor(
    @Inject(UPDATE_GUESS_USE_CASE_INTERFACE)
    private readonly updateGuessUseCase: UpdateGuessUseCaseInterface,
  ) {}

  @Patch(':guessId')
  @UseGuards(AccessTokenGuard)
  async handle(
    @Req() request: AuthenticatedRequest,
    @Param('guessId') guessId: string,
    @Body() body: UpdateGuessRequest,
  ): Promise<GuessResponse> {
    const output = await this.updateGuessUseCase.execute({
      guessId,
      userId: request.user.userId,
      guessedHomeScore: body.guessedHomeScore,
      guessedAwayScore: body.guessedAwayScore,
    });

    return GuessMapper.toResponse(output);
  }
}
