import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Post } from '@nestjs/common';

import { SIGN_IN_USE_CASE_INTERFACE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { SignInUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/sign-in.use-case.interface';
import type { SignInRequest } from '@src/modules/auth/adapters/http/dto/request/sign-in.request';
import type { AuthTokenResponse } from '@src/modules/auth/adapters/http/dto/response/auth-token.response';
import { AuthTokenMapper } from '@src/modules/auth/adapters/http/mappers/auth-token.mapper';

@ApiTags('Auth')
@Controller('auth')
export class SignInController {
  constructor(
    @Inject(SIGN_IN_USE_CASE_INTERFACE)
    private readonly signInUseCase: SignInUseCaseInterface,
  ) {}

  @Post('sign-in')
  async handle(@Body() body: SignInRequest): Promise<AuthTokenResponse> {
    const output = await this.signInUseCase.execute({
      phone: body.phone,
      password: body.password,
    });

    return AuthTokenMapper.toResponse(output);
  }
}
