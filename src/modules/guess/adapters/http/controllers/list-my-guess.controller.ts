import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { LIST_MY_GUESS_USE_CASE_INTERFACE } from '@src/modules/guess/application/contracts/tokens/guess.tokens';
import type { ListMyGuessUseCaseInterface } from '@src/modules/guess/application/contracts/use-cases/list-my-guess.use-case.interface';
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
export class ListMyGuessController {
  constructor(
    @Inject(LIST_MY_GUESS_USE_CASE_INTERFACE)
    private readonly listMyGuessUseCase: ListMyGuessUseCaseInterface,
  ) {}

  @Get('me')
  @UseGuards(AccessTokenGuard)
  async handle(@Req() request: AuthenticatedRequest): Promise<GuessResponse[]> {
    const output = await this.listMyGuessUseCase.execute({
      userId: request.user.userId,
    });

    return GuessMapper.toResponseList(output);
  }
}
