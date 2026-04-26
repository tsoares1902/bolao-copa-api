import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject, UseGuards } from '@nestjs/common';

import { LIST_GUESS_USE_CASE_INTERFACE } from '@src/modules/guess/application/contracts/tokens/guess.tokens';
import type { ListGuessUseCaseInterface } from '@src/modules/guess/application/contracts/use-cases/list-guess.use-case.interface';
import { GuessResponse } from '@src/modules/guess/adapters/http/dto/response/guess.response';
import { GuessMapper } from '@src/modules/guess/adapters/http/mappers/guess.mapper';
import { AccessTokenGuard } from '@src/modules/auth/adapters/http/guards/access-token.guard';

@ApiTags('Guess')
@Controller('guess')
export class ListGuessController {
  constructor(
    @Inject(LIST_GUESS_USE_CASE_INTERFACE)
    private readonly listGuessUseCase: ListGuessUseCaseInterface,
  ) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async handle(): Promise<GuessResponse[]> {
    const output = await this.listGuessUseCase.execute();

    return GuessMapper.toResponseList(output);
  }
}
