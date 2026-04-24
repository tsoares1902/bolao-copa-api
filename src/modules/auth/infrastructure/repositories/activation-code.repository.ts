import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ActivationCodeDocument,
  ActivationCodeSchema,
} from '@src/modules/auth/infrastructure/database/mongoose/schemas/activation-code.schema';
import { ActivationCodeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/activation-code.repository.interface';
import { ActivationCodeEntity } from '@src/modules/auth/domain/entities/activation-code.entity';
import { ActivationCodeType } from '@src/modules/auth/domain/enums/activation-code-type.enum';

@Injectable()
export class ActivationCodeRepository implements ActivationCodeRepositoryInterface {
  constructor(
    @InjectModel(ActivationCodeSchema.name)
    private readonly activationCodeModel: Model<ActivationCodeDocument>,
  ) {}

  async create(input: ActivationCodeEntity): Promise<ActivationCodeEntity> {
    const activationCode = await this.activationCodeModel.create(input);

    return this.toEntity(activationCode);
  }

  async findValidByPhoneAndCode(input: {
    phone: string;
    code: string;
    type: ActivationCodeType;
  }): Promise<ActivationCodeEntity | null> {
    const activationCode = await this.activationCodeModel
      .findOne({
        phone: input.phone,
        code: input.code,
        type: input.type,
        isUsed: false,
        expiresAt: {
          $gt: new Date(),
        },
      })
      .exec();

    return activationCode ? this.toEntity(activationCode) : null;
  }

  async invalidateAllByPhone(input: {
    phone: string;
    type: ActivationCodeType;
  }): Promise<void> {
    await this.activationCodeModel
      .updateMany(
        {
          phone: input.phone,
          type: input.type,
          isUsed: false,
        },
        {
          $set: {
            isUsed: true,
          },
        },
      )
      .exec();
  }

  async markAsUsed(activationCodeId: string): Promise<void> {
    await this.activationCodeModel
      .findByIdAndUpdate(activationCodeId, {
        $set: {
          isUsed: true,
        },
      })
      .exec();
  }

  private toEntity(
    activationCode: ActivationCodeDocument,
  ): ActivationCodeEntity {
    return {
      _id: activationCode._id.toString(),
      phone: activationCode.phone,
      code: activationCode.code,
      type: activationCode.type,
      isUsed: activationCode.isUsed,
      expiresAt: activationCode.expiresAt,
    };
  }
}
