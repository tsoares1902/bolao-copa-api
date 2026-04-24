import { AuthTokenOutput } from '@src/modules/auth/application/dto/output/auth-token.output';

export class AuthTokenOutputMapper {
  static toOutput(input: {
    accessToken: string;
    refreshToken: string;
  }): AuthTokenOutput {
    return {
      accessToken: input.accessToken,
      refreshToken: input.refreshToken,
    };
  }
}
