import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { TeamSchema } from '@src/modules/team/infrastructure/database/mongoose/schemas/team.schema';
import type { TeamDocument } from '@src/modules/team/infrastructure/database/mongoose/schemas/team.schema';
import type { TeamRepositoryInterface } from '@src/modules/team/application/contracts/repositories/team.repository.interface';
import type { TeamEntity } from '@src/modules/team/domain/entities/team.entity';
import type { CreateTeamInput } from '@src/modules/team/application/dto/input/create-team.input';
import type { UpdateTeamInput } from '@src/modules/team/application/dto/input/update-team.input';

@Injectable()
export class TeamRepository implements TeamRepositoryInterface {
  constructor(
    @InjectModel(TeamSchema.name)
    private readonly teamModel: Model<TeamDocument>,
  ) {}

  async list(): Promise<TeamEntity[]> {
    const teams = await this.teamModel.find().sort({ name: 1 }).exec();

    return teams.map((team) => this.toEntity(team));
  }

  async create(input: CreateTeamInput): Promise<TeamEntity> {
    const team = await this.teamModel.create(input);

    return this.toEntity(team);
  }

  async read(_id: string): Promise<TeamEntity | null> {
    const team = await this.teamModel.findById(_id).exec();

    if (!team) {
      return null;
    }

    return this.toEntity(team);
  }

  async update(input: UpdateTeamInput): Promise<TeamEntity | null> {
    const { _id, ...data } = input;

    const team = await this.teamModel
      .findByIdAndUpdate(_id, data, {
        new: true,
      })
      .exec();

    if (!team) {
      return null;
    }

    return this.toEntity(team);
  }

  async delete(_id: string): Promise<void> {
    await this.teamModel.findByIdAndDelete(_id).exec();
  }

  private toEntity(team: TeamDocument): TeamEntity {
    return {
      _id: team._id.toString(),
      name: team.name,
      isoCode: team.isoCode,
      flagEmoji: team.flagEmoji,
    };
  }
}
