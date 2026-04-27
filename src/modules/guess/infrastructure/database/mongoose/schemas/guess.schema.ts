import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GuessDocument = HydratedDocument<GuessSchema>;

@Schema({
  collection: 'guesses',
  timestamps: true,
})
export class GuessSchema {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'UserSchema',
  })
  userId!: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'MatchSchema',
  })
  matchId!: string;

  @Prop({
    required: true,
    min: 0,
  })
  guessedHomeScore!: number;

  @Prop({
    required: true,
    min: 0,
  })
  guessedAwayScore!: number;

  @Prop({
    required: true,
    default: 0,
    min: 0,
  })
  pointsEarned!: number;

  @Prop({
    required: true,
    default: false,
  })
  isCalculated!: boolean;

  @Prop({
    required: false,
  })
  calculatedAt?: Date;
}

export const GuessSchemaFactory = SchemaFactory.createForClass(GuessSchema);

GuessSchemaFactory.index(
  {
    userId: 1,
    matchId: 1,
  },
  {
    unique: true,
  },
);
