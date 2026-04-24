import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { StadiumSchema } from '@src/modules/stadium/infrastructure/database/mongoose/schemas/stadium.schema';
import type { StadiumDocument } from '@src/modules/stadium/infrastructure/database/mongoose/schemas/stadium.schema';
import type { StadiumRepositoryInterface } from '@src/modules/stadium/application/contracts/repositories/stadium.repository.interface';
import type { StadiumEntity } from '@src/modules/stadium/domain/entities/stadium.entity';
import type { CreateStadiumInput } from '@src/modules/stadium/application/dto/input/create-stadium.input';
import type { UpdateStadiumInput } from '@src/modules/stadium/application/dto/input/update-stadium.input';

@Injectable()
export class StadiumRepository implements StadiumRepositoryInterface {
  constructor(
    @InjectModel(StadiumSchema.name)
    private readonly stadiumModel: Model<StadiumDocument>,
  ) {}

  async list(): Promise<StadiumEntity[]> {
    const stadiums = await this.stadiumModel.find().sort({ name: 1 }).exec();

    return stadiums.map((stadium) => this.toEntity(stadium));
  }

  async create(input: CreateStadiumInput): Promise<StadiumEntity> {
    const stadium = await this.stadiumModel.create(input);

    return this.toEntity(stadium);
  }

  async read(stadiumId: string): Promise<StadiumEntity | null> {
    const stadium = await this.stadiumModel.findById(stadiumId).exec();

    if (!stadium) {
      return null;
    }

    return this.toEntity(stadium);
  }

  async update(input: UpdateStadiumInput): Promise<StadiumEntity | null> {
    const { stadiumId, ...data } = input;

    const stadium = await this.stadiumModel
      .findByIdAndUpdate(stadiumId, data, {
        new: true,
      })
      .exec();

    if (!stadium) {
      return null;
    }

    return this.toEntity(stadium);
  }

  async delete(stadiumId: string): Promise<void> {
    await this.stadiumModel.findByIdAndDelete(stadiumId).exec();
  }

  private toEntity(stadium: StadiumDocument): StadiumEntity {
    return {
      _id: stadium._id.toString(),
      name: stadium.name,
      city: stadium.city,
      capacity: stadium.capacity,
      midia: stadium.midia
        ? {
            photoUrl: stadium.midia.photoUrl,
          }
        : undefined,
    };
  }
}
