import { AuthSessionEntity } from '@src/modules/auth/domain/entities/auth-session.entity';

export interface AuthSessionRepositoryInterface {
  create(input: AuthSessionEntity): Promise<AuthSessionEntity>;
  findValidByRefreshToken(
    refreshToken: string,
  ): Promise<AuthSessionEntity | null>;
  revokeByRefreshToken(refreshToken: string): Promise<void>;
  revokeAllByUserId(userId: string): Promise<void>;
}
