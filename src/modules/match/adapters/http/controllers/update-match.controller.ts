import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';

import { UPDATE_MATCH_USE_CASE_INTERFACE } from '@src/modules/match/application/contracts/tokens/match.tokens';
import type { UpdateMatchUseCaseInterface } from '@src/modules/match/application/contracts/use-cases/update-match.use-case.interface';
import { UpdateMatchRequest } from '@src/modules/match/adapters/http/dto/request/update-match.request';
import type { MatchResponse } from '@src/modules/match/adapters/http/dto/response/match.response';
import { MatchMapper } from '@src/modules/match/adapters/http/mappers/match.mapper';

@ApiTags('Match')
@Controller('match')
export class UpdateMatchController {
  constructor(
    @Inject(UPDATE_MATCH_USE_CASE_INTERFACE)
    private readonly updateMatchUseCase: UpdateMatchUseCaseInterface,
  ) {}

  @Patch(':matchId')
  async handle(
    @Param('matchId') matchId: string,
    @Body() body: UpdateMatchRequest,
  ): Promise<MatchResponse> {
    const output = await this.updateMatchUseCase.execute({
      matchId,
      homeTeamId: body.homeTeamId,
      awayTeamId: body.awayTeamId,
      stadiumId: body.stadiumId,
      matchDate: body.matchDate ? new Date(body.matchDate) : undefined,
      phase: body.phase,
      groupName: body.groupName,
      homeTeamScore: body.homeTeamScore,
      awayTeamScore: body.awayTeamScore,
      status: body.status,
    });

    return MatchMapper.toResponse(output);
  }
}
