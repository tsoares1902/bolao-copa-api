import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Post } from '@nestjs/common';

import { REFRESH_USE_CASE_INTERFACE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { RefreshUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/refresh.use-case.interface';
import type { RefreshRequest } from '@src/modules/auth/adapters/http/dto/request/refresh.request';
import type { AuthTokenResponse } from '@src/modules/auth/adapters/http/dto/response/auth-token.response';
import { AuthTokenMapper } from '@src/modules/auth/adapters/http/mappers/auth-token.mapper';

@ApiTags('Auth')
@Controller('auth')
export class RefreshController {
  constructor(
    @Inject(REFRESH_USE_CASE_INTERFACE)
    private readonly refreshUseCase: RefreshUseCaseInterface,
  ) {}

  @Post('refresh')
  async handle(@Body() body: RefreshRequest): Promise<AuthTokenResponse> {
    const output = await this.refreshUseCase.execute({
      refreshToken: body.refreshToken,
    });

    return AuthTokenMapper.toResponse(output);
  }
}
