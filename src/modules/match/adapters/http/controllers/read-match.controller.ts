import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject, Param } from '@nestjs/common';

import { READ_MATCH_USE_CASE_INTERFACE } from '@src/modules/match/application/contracts/tokens/match.tokens';
import type { ReadMatchUseCaseInterface } from '@src/modules/match/application/contracts/use-cases/read-match.use-case.interface';
import type { MatchResponse } from '@src/modules/match/adapters/http/dto/response/match.response';
import { MatchMapper } from '@src/modules/match/adapters/http/mappers/match.mapper';

@ApiTags('Match')
@Controller('match')
export class ReadMatchController {
  constructor(
    @Inject(READ_MATCH_USE_CASE_INTERFACE)
    private readonly readMatchUseCase: ReadMatchUseCaseInterface,
  ) {}

  @Get(':matchId')
  async handle(@Param('matchId') matchId: string): Promise<MatchResponse> {
    const output = await this.readMatchUseCase.execute({ matchId });

    return MatchMapper.toResponse(output);
  }
}
