import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import type { SignInInput } from '@src/modules/auth/application/dto/input/sign-in.input';
import type { AuthTokenOutput } from '@src/modules/auth/application/dto/output/auth-token.output';
import type { SignInUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/sign-in.use-case.interface';
import { USER_REPOSITORY_INTERFACE } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { UserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/user.repository.interface';
import { AUTH_SESSION_REPOSITORY_INTERFACE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { AuthSessionRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/auth-session.repository.interface';
import { generateRefreshToken } from '@src/modules/auth/application/helpers/generate-refresh-token.helper';
import { AuthTokenOutputMapper } from '@src/modules/auth/application/mappers/auth-token-output.mapper';

@Injectable()
export class SignInUseCase implements SignInUseCaseInterface {
  constructor(
    @Inject(USER_REPOSITORY_INTERFACE)
    private readonly userRepository: UserRepositoryInterface,
    @Inject(AUTH_SESSION_REPOSITORY_INTERFACE)
    private readonly authSessionRepository: AuthSessionRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: SignInInput): Promise<AuthTokenOutput> {
    const user = await this.userRepository.findByPhone(input.phone);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password);

    if (!passwordMatches) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException(
        'Account not activated!. Please activate your account before logging in.',
      );
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user._id,
      phone: user.phone.number,
    });

    const refreshToken = generateRefreshToken();

    await this.authSessionRepository.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      isRevoked: false,
    });

    return AuthTokenOutputMapper.toOutput({
      accessToken,
      refreshToken,
    });
  }
}
