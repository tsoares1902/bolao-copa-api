import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';

import { CREATE_ACTIVATION_CODE_USE_CASE_INTERFACE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { CreateActivationCodeUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/create-activation-code.use-case.interface';
import type { ActivationCodeRequest } from '@src/modules/auth/adapters/http/dto/request/activation-code.request';

@ApiTags('Auth')
@Controller('auth')
export class ActivationCodeController {
  constructor(
    @Inject(CREATE_ACTIVATION_CODE_USE_CASE_INTERFACE)
    private readonly createActivationCodeUseCase: CreateActivationCodeUseCaseInterface,
  ) {}

  @Post('activation-code')
  @HttpCode(204)
  async handle(@Body() body: ActivationCodeRequest): Promise<void> {
    await this.createActivationCodeUseCase.execute({
      phone: body.phone,
    });
  }
}
