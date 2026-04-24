import { AuthTokenOutput } from '@src/modules/auth/application/dto/output/auth-token.output';
import { AuthTokenResponse } from '@src/modules/auth/adapters/http/dto/response/auth-token.response';

export class AuthTokenMapper {
  static toResponse(output: AuthTokenOutput): AuthTokenResponse {
    return {
      accessToken: output.accessToken,
      refreshToken: output.refreshToken,
    };
  }
}
