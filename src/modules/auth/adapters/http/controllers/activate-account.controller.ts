import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';

import { ACTIVATE_ACCOUNT_USE_CASE_INTERFACE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { ActivateAccountUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/activate-account.use-case.interface';
import type { ActivateAccountRequest } from '@src/modules/auth/adapters/http/dto/request/activate-account.request';

@ApiTags('Auth')
@Controller('auth')
export class ActivateAccountController {
  constructor(
    @Inject(ACTIVATE_ACCOUNT_USE_CASE_INTERFACE)
    private readonly activateAccountUseCase: ActivateAccountUseCaseInterface,
  ) {}

  @Post('activate-account')
  @HttpCode(204)
  async handle(@Body() body: ActivateAccountRequest): Promise<void> {
    await this.activateAccountUseCase.execute({
      phone: body.phone,
      code: body.code,
    });
  }
}
