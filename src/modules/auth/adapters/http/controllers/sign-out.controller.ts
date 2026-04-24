import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';

import { SIGN_OUT_USE_CASE_INTERFACE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { SignOutUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/sign-out.use-case.interface';
import type { SignOutRequest } from '@src/modules/auth/adapters/http/dto/request/sign-out.request';

@ApiTags('Auth')
@Controller('auth')
export class SignOutController {
  constructor(
    @Inject(SIGN_OUT_USE_CASE_INTERFACE)
    private readonly signOutUseCase: SignOutUseCaseInterface,
  ) {}

  @Post('sign-out')
  @HttpCode(204)
  async handle(@Body() body: SignOutRequest): Promise<void> {
    await this.signOutUseCase.execute({
      refreshToken: body.refreshToken,
    });
  }
}
