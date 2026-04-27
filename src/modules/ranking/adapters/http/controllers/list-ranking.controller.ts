import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject, UseGuards } from '@nestjs/common';

import { LIST_RANKING_USE_CASE_INTERFACE } from '@src/modules/ranking/application/contracts/tokens/ranking.tokens';
import { RankingResponse } from '@src/modules/ranking/adapters/http/dto/response/ranking.response';
import { RankingMapper } from '@src/modules/ranking/adapters/http/mappers/ranking.mapper';
import { AccessTokenGuard } from '@src/modules/auth/adapters/http/guards/access-token.guard';
import type { ListRankingUseCaseInterface } from '@src/modules/ranking/application/contracts/use-cases/list-ranking.use-case.interface';

@ApiTags('Ranking')
@Controller('ranking')
export class ListRankingController {
  constructor(
    @Inject(LIST_RANKING_USE_CASE_INTERFACE)
    private readonly listRankingUseCase: ListRankingUseCaseInterface,
  ) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async handle(): Promise<RankingResponse[]> {
    const output = await this.listRankingUseCase.execute();

    return RankingMapper.toResponseList(output);
  }
}
