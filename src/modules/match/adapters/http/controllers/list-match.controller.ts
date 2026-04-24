import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject } from '@nestjs/common';

import { LIST_MATCH_USE_CASE_INTERFACE } from '@src/modules/match/application/contracts/tokens/match.tokens';
import type { ListMatchUseCaseInterface } from '@src/modules/match/application/contracts/use-cases/list-match.use-case.interface';
import type { MatchResponse } from '@src/modules/match/adapters/http/dto/response/match.response';
import { MatchMapper } from '@src/modules/match/adapters/http/mappers/match.mapper';

@ApiTags('Match')
@Controller('match')
export class ListMatchController {
  constructor(
    @Inject(LIST_MATCH_USE_CASE_INTERFACE)
    private readonly listMatchUseCase: ListMatchUseCaseInterface,
  ) {}

  @Get()
  async handle(): Promise<MatchResponse[]> {
    const output = await this.listMatchUseCase.execute();

    return MatchMapper.toResponseList(output);
  }
}
