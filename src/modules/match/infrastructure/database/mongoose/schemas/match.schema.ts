import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { MatchGroup } from '@src/modules/match/domain/enums/match-group.enum';
import { MatchPhase } from '@src/modules/match/domain/enums/match-phase.enum';
import { MatchStatus } from '@src/modules/match/domain/enums/match-status.enum';

export type MatchDocument = HydratedDocument<MatchSchema>;

@Schema({
  collection: 'matches',
  timestamps: true,
})
export class MatchSchema {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'TeamSchema',
  })
  homeTeamId!: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'TeamSchema',
  })
  awayTeamId!: string;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'StadiumSchema',
  })
  stadiumId!: string;

  @Prop({
    required: true,
  })
  matchDate!: Date;

  @Prop({
    required: true,
    enum: MatchPhase,
  })
  phase!: MatchPhase;

  @Prop({
    required: false,
    enum: MatchGroup,
  })
  groupName?: MatchGroup;

  @Prop({
    required: false,
    type: Number,
    default: null,
  })
  homeTeamScore?: number | null;

  @Prop({
    required: false,
    type: Number,
    default: null,
  })
  awayTeamScore?: number | null;

  @Prop({
    required: true,
    enum: MatchStatus,
    default: MatchStatus.SCHEDULED,
  })
  status!: MatchStatus;
}

export const MatchSchemaFactory = SchemaFactory.createForClass(MatchSchema);
