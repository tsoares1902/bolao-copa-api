import { ApiTags } from '@nestjs/swagger';
import { Controller, Delete, HttpCode, Inject, Param } from '@nestjs/common';

import { DELETE_MATCH_USE_CASE_INTERFACE } from '@src/modules/match/application/contracts/tokens/match.tokens';
import type { DeleteMatchUseCaseInterface } from '@src/modules/match/application/contracts/use-cases/delete-match.use-case.interface';

@ApiTags('Match')
@Controller('match')
export class DeleteMatchController {
  constructor(
    @Inject(DELETE_MATCH_USE_CASE_INTERFACE)
    private readonly deleteMatchUseCase: DeleteMatchUseCaseInterface,
  ) {}

  @Delete(':matchId')
  @HttpCode(204)
  async handle(@Param('matchId') matchId: string): Promise<void> {
    await this.deleteMatchUseCase.execute({ matchId });
  }
}
