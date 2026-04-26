import {
  Controller,
  Delete,
  HttpCode,
  Inject,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { DELETE_GUESS_USE_CASE_INTERFACE } from '@src/modules/guess/application/contracts/tokens/guess.tokens';
import type { DeleteGuessUseCaseInterface } from '@src/modules/guess/application/contracts/use-cases/delete-guess.use-case.interface';
import { AccessTokenGuard } from '@src/modules/auth/adapters/http/guards/access-token.guard';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    phone?: string;
  };
};

@ApiTags('Guess')
@Controller('guess')
export class DeleteGuessController {
  constructor(
    @Inject(DELETE_GUESS_USE_CASE_INTERFACE)
    private readonly deleteGuessUseCase: DeleteGuessUseCaseInterface,
  ) {}

  @Delete(':guessId')
  @UseGuards(AccessTokenGuard)
  @HttpCode(204)
  async handle(
    @Req() request: AuthenticatedRequest,
    @Param('guessId') guessId: string,
  ): Promise<void> {
    await this.deleteGuessUseCase.execute({
      guessId,
      userId: request.user.userId,
    });
  }
}
