import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';

import { UPDATE_STADIUM_USE_CASE_INTERFACE } from '@src/modules/stadium/application/contracts/tokens/stadium.tokens';
import type { UpdateStadiumUseCaseInterface } from '@src/modules/stadium/application/contracts/use-cases/update-stadium.use-case.interface';
import type { UpdateStadiumRequest } from '@src/modules/stadium/adapters/http/dto/request/update-stadium.request';
import type { StadiumResponse } from '@src/modules/stadium/adapters/http/dto/response/stadium.response';
import { StadiumMapper } from '@src/modules/stadium/adapters/http/mappers/stadium.mapper';

@ApiTags('Stadium')
@Controller('stadium')
export class UpdateStadiumController {
  constructor(
    @Inject(UPDATE_STADIUM_USE_CASE_INTERFACE)
    private readonly updateStadiumUseCase: UpdateStadiumUseCaseInterface,
  ) {}

  @Patch(':stadiumId')
  async handle(
    @Param('stadiumId') stadiumId: string,
    @Body() body: UpdateStadiumRequest,
  ): Promise<StadiumResponse> {
    const output = await this.updateStadiumUseCase.execute({
      stadiumId,
      name: body.name,
      city: body.city,
      capacity: body.capacity,
      midia: body.midia
        ? {
            photoUrl: body.midia.photoUrl,
          }
        : undefined,
    });

    return StadiumMapper.toResponse(output);
  }
}
