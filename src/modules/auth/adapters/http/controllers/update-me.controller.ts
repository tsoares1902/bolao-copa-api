import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Inject,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { UPDATE_ME_USE_CASE_INTERFACE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { UpdateMeUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/update-me.use-case.interface';
import { UpdateMeRequest } from '@src/modules/auth/adapters/http/dto/request/update-me.request';
import { AccessTokenGuard } from '@src/modules/auth/adapters/http/guards/access-token.guard';
import type { UserResponse } from '@src/modules/user/adapters/http/dto/response/user.response';
import { UserMapper } from '@src/modules/user/adapters/http/mappers/user.mapper';

type AuthenticatedRequest = Request & {
  user: {
    userId: string;
    phone?: string;
  };
};

@ApiTags('Auth')
@Controller('auth')
export class UpdateMeController {
  constructor(
    @Inject(UPDATE_ME_USE_CASE_INTERFACE)
    private readonly updateMeUseCase: UpdateMeUseCaseInterface,
  ) {}

  @Patch('me')
  @UseGuards(AccessTokenGuard)
  async handle(
    @Req() request: AuthenticatedRequest,
    @Body() body: UpdateMeRequest,
  ): Promise<UserResponse> {
    const output = await this.updateMeUseCase.execute({
      userId: request.user.userId,
      name: body.name,
      alias: body.alias,
      phone: body.phone,
      media: body.media,
    });

    return UserMapper.toResponse(output);
  }
}
