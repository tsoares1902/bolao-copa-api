import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  UserDocument,
  UserSchema,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import { UserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/user.repository.interface';
import { CreateUserInput } from '@src/modules/user/application/dto/input/create-user.input';
import { UpdateUserInput } from '@src/modules/user/application/dto/input/update-user.input';
import { UserEntity } from '@src/modules/user/domain/entities/user.entity';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async list(): Promise<UserEntity[]> {
    const users = await this.userModel.find().sort({ name: 1 }).exec();

    return users.map((user) => this.toEntity(user));
  }

  async create(input: CreateUserInput): Promise<UserEntity> {
    const user = await this.userModel.create(input);

    return this.toEntity(user);
  }

  async read(userId: string): Promise<UserEntity | null> {
    const user = await this.userModel.findById(userId).exec();

    return user ? this.toEntity(user) : null;
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    const user = await this.userModel
      .findOne({
        'phone.number': phone,
      })
      .exec();

    return user ? this.toEntity(user) : null;
  }

  async update(input: UpdateUserInput): Promise<UserEntity | null> {
    const { userId, ...data } = input;

    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $set: data,
        },
        {
          new: true,
        },
      )
      .exec();

    return user ? this.toEntity(user) : null;
  }

  async delete(userId: string): Promise<void> {
    await this.userModel.findByIdAndDelete(userId).exec();
  }

  async activateByPhone(phone: string): Promise<void> {
    await this.userModel
      .updateOne(
        {
          'phone.number': phone,
        },
        {
          $set: {
            isActive: true,
          },
        },
      )
      .exec();
  }

  private toEntity(user: UserDocument): UserEntity {
    return {
      _id: user._id.toString(),
      name: user.name,
      alias: user.alias,
      password: user.password,
      phone: {
        number: user.phone.number,
        isWhatsapp: user.phone.isWhatsapp,
      },
      media: user.media
        ? {
            avatarUrl: user.media.avatarUrl,
          }
        : undefined,
      isActive: user.isActive,
    };
  }
}
