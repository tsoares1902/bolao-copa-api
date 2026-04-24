import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import type { ActivateAccountInput } from '@src/modules/auth/application/dto/input/activate-account.input';
import type { ActivateAccountUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/activate-account.use-case.interface';
import type { ActivationCodeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/activation-code.repository.interface';
import { ACTIVATION_CODE_REPOSITORY_INTERFACE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import { ActivationCodeType } from '@src/modules/auth/domain/enums/activation-code-type.enum';
import { USER_REPOSITORY_INTERFACE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { UserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/user.repository.interface';

@Injectable()
export class ActivateAccountUseCase implements ActivateAccountUseCaseInterface {
  constructor(
    @Inject(ACTIVATION_CODE_REPOSITORY_INTERFACE)
    private readonly activationCodeRepository: ActivationCodeRepositoryInterface,

    @Inject(USER_REPOSITORY_INTERFACE)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(input: ActivateAccountInput): Promise<void> {
    const activationCode =
      await this.activationCodeRepository.findValidByPhoneAndCode({
        phone: input.phone,
        code: input.code,
        type: ActivationCodeType.ACCOUNT_ACTIVATION,
      });

    if (!activationCode) {
      throw new BadRequestException('Invalid or expired activation code');
    }

    await this.activationCodeRepository.markAsUsed(activationCode._id);

    await this.userRepository.activateByPhone(input.phone);
  }
}
