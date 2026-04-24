import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { RefreshInput } from '@src/modules/auth/application/dto/input/refresh.input';
import type { RefreshUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/refresh.use-case.interface';
import type { AuthTokenOutput } from '@src/modules/auth/application/dto/output/auth-token.output';
import { AUTH_SESSION_REPOSITORY_INTERFACE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { AuthSessionRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/auth-session.repository.interface';
import { AuthTokenOutputMapper } from '@src/modules/auth/application/mappers/auth-token-output.mapper';

@Injectable()
export class RefreshUseCase implements RefreshUseCaseInterface {
  constructor(
    @Inject(AUTH_SESSION_REPOSITORY_INTERFACE)
    private readonly authSessionRepository: AuthSessionRepositoryInterface,

    private readonly jwtService: JwtService,
  ) {}

  async execute(input: RefreshInput): Promise<AuthTokenOutput> {
    const session = await this.authSessionRepository.findValidByRefreshToken(
      input.refreshToken,
    );

    if (!session) {
      throw new BadRequestException('Invalid refresh token');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: session.userId,
    });

    return AuthTokenOutputMapper.toOutput({
      accessToken,
      refreshToken: input.refreshToken,
    });
  }
}
