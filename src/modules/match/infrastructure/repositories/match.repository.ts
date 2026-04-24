import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { MatchSchema } from '@src/modules/match/infrastructure/database/mongoose/schemas/match.schema';
import type { MatchDocument } from '@src/modules/match/infrastructure/database/mongoose/schemas/match.schema';
import type { MatchRepositoryInterface } from '@src/modules/match/application/contracts/repositories/match.repository.interface';
import type { MatchEntity } from '@src/modules/match/domain/entities/match.entity';
import type { CreateMatchInput } from '@src/modules/match/application/dto/input/create-match.input';
import type { UpdateMatchInput } from '@src/modules/match/application/dto/input/update-match.input';

@Injectable()
export class MatchRepository implements MatchRepositoryInterface {
  constructor(
    @InjectModel(MatchSchema.name)
    private readonly matchModel: Model<MatchDocument>,
  ) {}

  async list(): Promise<MatchEntity[]> {
    const matches = await this.matchModel.find().sort({ matchDate: 1 }).exec();

    return matches.map((match) => this.toEntity(match));
  }

  async create(input: CreateMatchInput): Promise<MatchEntity> {
    const match = await this.matchModel.create(input);

    return this.toEntity(match);
  }

  async read(matchId: string): Promise<MatchEntity | null> {
    const match = await this.matchModel.findById(matchId).exec();

    if (!match) {
      return null;
    }

    return this.toEntity(match);
  }

  async update(input: UpdateMatchInput): Promise<MatchEntity | null> {
    const { matchId, ...data } = input;

    const match = await this.matchModel
      .findByIdAndUpdate(matchId, data, {
        new: true,
      })
      .exec();

    if (!match) {
      return null;
    }

    return this.toEntity(match);
  }

  async delete(matchId: string): Promise<void> {
    await this.matchModel.findByIdAndDelete(matchId).exec();
  }

  private toEntity(match: MatchDocument): MatchEntity {
    return {
      _id: match._id.toString(),
      homeTeamId: match.homeTeamId.toString(),
      awayTeamId: match.awayTeamId.toString(),
      stadiumId: match.stadiumId.toString(),
      matchDate: match.matchDate,
      phase: match.phase,
      groupName: match.groupName,
      homeTeamScore: match.homeTeamScore,
      awayTeamScore: match.awayTeamScore,
      status: match.status,
    };
  }
}
