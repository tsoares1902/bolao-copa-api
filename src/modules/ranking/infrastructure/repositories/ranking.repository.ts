import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  GuessDocument,
  GuessSchema,
} from '@src/modules/guess/infrastructure/database/mongoose/schemas/guess.schema';
import { RankingRepositoryInterface } from '@src/modules/ranking/application/contracts/repositories/ranking.repository.interface';
import { RankingEntity } from '@src/modules/ranking/domain/entities/ranking.entity';

type RankingAggregateResult = {
  userId: Types.ObjectId;
  name: string;
  alias?: string;
  totalPoints: number;
  totalGuesses: number;
};

@Injectable()
export class RankingRepository implements RankingRepositoryInterface {
  constructor(
    @InjectModel(GuessSchema.name)
    private readonly guessModel: Model<GuessDocument>,
  ) {}

  async list(): Promise<RankingEntity[]> {
    const rankings = await this.guessModel.aggregate<RankingAggregateResult>([
      {
        $match: {
          isCalculated: true,
        },
      },
      {
        $group: {
          _id: '$userId',
          totalPoints: {
            $sum: '$pointsEarned',
          },
          totalGuesses: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$user.name',
          alias: '$user.alias',
          totalPoints: 1,
          totalGuesses: 1,
        },
      },
      {
        $sort: {
          totalPoints: -1,
          totalGuesses: -1,
          name: 1,
        },
      },
    ]);

    return rankings.map((ranking, index) => ({
      userId: ranking.userId.toString(),
      name: ranking.name,
      alias: ranking.alias,
      totalPoints: ranking.totalPoints,
      totalGuesses: ranking.totalGuesses,
      position: index + 1,
    }));
  }
}
