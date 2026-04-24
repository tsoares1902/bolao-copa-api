import { Inject, Injectable } from '@nestjs/common';

import type { SignOutInput } from '@src/modules/auth/application/dto/input/sign-out.input';
import type { SignOutUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/sign-out.use-case.interface';
import { AUTH_SESSION_REPOSITORY_INTERFACE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { AuthSessionRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/auth-session.repository.interface';

@Injectable()
export class SignOutUseCase implements SignOutUseCaseInterface {
  constructor(
    @Inject(AUTH_SESSION_REPOSITORY_INTERFACE)
    private readonly authSessionRepository: AuthSessionRepositoryInterface,
  ) {}

  async execute(input: SignOutInput): Promise<void> {
    await this.authSessionRepository.revokeByRefreshToken(input.refreshToken);
  }
}
