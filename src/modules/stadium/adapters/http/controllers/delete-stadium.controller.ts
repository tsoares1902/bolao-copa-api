import { ApiTags } from '@nestjs/swagger';
import { Controller, Delete, HttpCode, Inject, Param } from '@nestjs/common';

import { DELETE_STADIUM_USE_CASE_INTERFACE } from '@src/modules/stadium/application/contracts/tokens/stadium.tokens';
import type { DeleteStadiumUseCaseInterface } from '@src/modules/stadium/application/contracts/use-cases/delete-stadium.use-case.interface';

@ApiTags('Stadium')
@Controller('stadium')
export class DeleteStadiumController {
  constructor(
    @Inject(DELETE_STADIUM_USE_CASE_INTERFACE)
    private readonly deleteStadiumUseCase: DeleteStadiumUseCaseInterface,
  ) {}

  @Delete(':stadiumId')
  @HttpCode(204)
  async handle(@Param('stadiumId') stadiumId: string): Promise<void> {
    await this.deleteStadiumUseCase.execute({ stadiumId });
  }
}
