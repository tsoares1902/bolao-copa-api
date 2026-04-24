import { Inject, Injectable } from '@nestjs/common';

import type { CreateActivationCodeInput } from '@src/modules/auth/application/dto/input/create-activation-code.input';
import type { CreateActivationCodeUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/create-activation-code.use-case.interface';
import type { ActivationCodeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/activation-code.repository.interface';
import { ACTIVATION_CODE_REPOSITORY_INTERFACE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import { ActivationCodeType } from '@src/modules/auth/domain/enums/activation-code-type.enum';
import { generateActivationCode } from '@src/modules/auth/application/helpers/generate-activation-code.helper';

@Injectable()
export class CreateActivationCodeUseCase implements CreateActivationCodeUseCaseInterface {
  constructor(
    @Inject(ACTIVATION_CODE_REPOSITORY_INTERFACE)
    private readonly activationCodeRepository: ActivationCodeRepositoryInterface,
  ) {}

  async execute(input: CreateActivationCodeInput): Promise<void> {
    await this.activationCodeRepository.invalidateAllByPhone({
      phone: input.phone,
      type: ActivationCodeType.ACCOUNT_ACTIVATION,
    });

    const code = generateActivationCode();

    await this.activationCodeRepository.create({
      phone: input.phone,
      code,
      type: ActivationCodeType.ACCOUNT_ACTIVATION,
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
      isUsed: false,
    });
  }
}
