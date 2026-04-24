import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  AuthSessionDocument,
  AuthSessionSchema,
} from '@src/modules/auth/infrastructure/database/mongoose/schemas/auth-session.schema';
import { AuthSessionRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/auth-session.repository.interface';
import { AuthSessionEntity } from '@src/modules/auth/domain/entities/auth-session.entity';

@Injectable()
export class AuthSessionRepository implements AuthSessionRepositoryInterface {
  constructor(
    @InjectModel(AuthSessionSchema.name)
    private readonly authSessionModel: Model<AuthSessionDocument>,
  ) {}

  async create(input: AuthSessionEntity): Promise<AuthSessionEntity> {
    const session = await this.authSessionModel.create(input);

    return this.toEntity(session);
  }

  async findValidByRefreshToken(
    refreshToken: string,
  ): Promise<AuthSessionEntity | null> {
    const session = await this.authSessionModel
      .findOne({
        refreshToken,
        isRevoked: false,
        expiresAt: {
          $gt: new Date(),
        },
      })
      .exec();

    return session ? this.toEntity(session) : null;
  }

  async revokeByRefreshToken(refreshToken: string): Promise<void> {
    await this.authSessionModel
      .updateOne(
        {
          refreshToken,
        },
        {
          $set: {
            isRevoked: true,
          },
        },
      )
      .exec();
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.authSessionModel
      .updateMany(
        {
          userId,
          isRevoked: false,
        },
        {
          $set: {
            isRevoked: true,
          },
        },
      )
      .exec();
  }

  private toEntity(session: AuthSessionDocument): AuthSessionEntity {
    return {
      _id: session._id.toString(),
      userId: session.userId.toString(),
      refreshToken: session.refreshToken,
      isRevoked: session.isRevoked,
      expiresAt: session.expiresAt,
    };
  }
}
