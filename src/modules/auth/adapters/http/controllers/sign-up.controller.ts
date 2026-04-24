import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';

import { SIGN_UP_USE_CASE_INTERFACE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { SignUpUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/sign-up.use-case.interface';
import { SignUpRequest } from '@src/modules/auth/adapters/http/dto/request/sign-up.request';

@ApiTags('Auth')
@Controller('auth')
export class SignUpController {
  constructor(
    @Inject(SIGN_UP_USE_CASE_INTERFACE)
    private readonly signUpUseCase: SignUpUseCaseInterface,
  ) {}

  @Post('sign-up')
  @HttpCode(201)
  async handle(@Body() body: SignUpRequest): Promise<void> {
    await this.signUpUseCase.execute({
      name: body.name,
      alias: body.alias,
      password: body.password,
      phone: body.phone,
      media: body.media,
    });
  }
}
