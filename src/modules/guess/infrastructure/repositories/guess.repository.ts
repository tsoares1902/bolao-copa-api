import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  GuessDocument,
  GuessSchema,
} from '@src/modules/guess/infrastructure/database/mongoose/schemas/guess.schema';
import { GuessRepositoryInterface } from '@src/modules/guess/application/contracts/repositories/guess.repository.interface';
import { GuessEntity } from '@src/modules/guess/domain/entities/guess.entity';
import { CreateGuessInput } from '@src/modules/guess/application/dto/input/create-guess.input';
import { UpdateGuessInput } from '@src/modules/guess/application/dto/input/update-guess.input';

@Injectable()
export class GuessRepository implements GuessRepositoryInterface {
  constructor(
    @InjectModel(GuessSchema.name)
    private readonly guessModel: Model<GuessDocument>,
  ) {}

  async list(): Promise<GuessEntity[]> {
    const guesses = await this.guessModel
      .find()
      .sort({
        createdAt: -1,
      })
      .exec();

    return guesses.map((guess) => this.toEntity(guess));
  }

  async create(input: CreateGuessInput): Promise<GuessEntity> {
    const guess = await this.guessModel.create({
      userId: input.userId,
      matchId: input.matchId,
      guessedHomeScore: input.guessedHomeScore,
      guessedAwayScore: input.guessedAwayScore,
      pointsEarned: 0,
    });

    return this.toEntity(guess);
  }

  async read(guessId: string): Promise<GuessEntity | null> {
    const guess = await this.guessModel.findById(guessId).exec();

    return guess ? this.toEntity(guess) : null;
  }

  async listByUser(userId: string): Promise<GuessEntity[]> {
    const guesses = await this.guessModel
      .find({
        userId,
      })
      .sort({
        createdAt: -1,
      })
      .exec();

    return guesses.map((guess) => this.toEntity(guess));
  }

  async listByMatch(matchId: string): Promise<GuessEntity[]> {
    const guesses = await this.guessModel
      .find({
        matchId,
      })
      .sort({
        createdAt: -1,
      })
      .exec();

    return guesses.map((guess) => this.toEntity(guess));
  }

  async findByUserAndMatch(input: {
    userId: string;
    matchId: string;
  }): Promise<GuessEntity | null> {
    const guess = await this.guessModel
      .findOne({
        userId: input.userId,
        matchId: input.matchId,
      })
      .exec();

    return guess ? this.toEntity(guess) : null;
  }

  async update(input: UpdateGuessInput): Promise<GuessEntity | null> {
    const { guessId, userId, ...data } = input;

    const guess = await this.guessModel
      .findOneAndUpdate(
        {
          _id: guessId,
          userId,
        },
        {
          $set: data,
        },
        {
          new: true,
        },
      )
      .exec();

    return guess ? this.toEntity(guess) : null;
  }

  async updatePoints(input: {
    guessId: string;
    pointsEarned: number;
    isCalculated: boolean;
    calculatedAt: Date;
  }): Promise<GuessEntity | null> {
    const guess = await this.guessModel
      .findByIdAndUpdate(
        input.guessId,
        {
          $set: {
            pointsEarned: input.pointsEarned,
            isCalculated: input.isCalculated,
            calculatedAt: input.calculatedAt,
          },
        },
        {
          new: true,
        },
      )
      .exec();

    return guess ? this.toEntity(guess) : null;
  }

  async delete(guessId: string): Promise<void> {
    await this.guessModel.findByIdAndDelete(guessId).exec();
  }

  private toEntity(guess: GuessDocument): GuessEntity {
    return {
      _id: guess._id.toString(),
      userId: guess.userId.toString(),
      matchId: guess.matchId.toString(),
      guessedHomeScore: guess.guessedHomeScore,
      guessedAwayScore: guess.guessedAwayScore,
      pointsEarned: guess.pointsEarned,
      isCalculated: guess.isCalculated,
      calculatedAt: guess.calculatedAt,
    };
  }
}
