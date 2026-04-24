import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

import { MatchGroup } from '@src/modules/match/domain/enums/match-group.enum';
import { MatchPhase } from '@src/modules/match/domain/enums/match-phase.enum';
import { MatchStatus } from '@src/modules/match/domain/enums/match-status.enum';

export class CreateMatchRequest {
  @IsMongoId()
  @IsNotEmpty()
  homeTeamId!: string;

  @IsMongoId()
  @IsNotEmpty()
  awayTeamId!: string;

  @IsMongoId()
  @IsNotEmpty()
  stadiumId!: string;

  @IsDateString()
  @IsNotEmpty()
  matchDate!: string;

  @IsEnum(MatchPhase)
  @IsNotEmpty()
  phase!: MatchPhase;

  @IsEnum(MatchGroup)
  @IsOptional()
  groupName?: MatchGroup;

  @IsNumber()
  @Min(0)
  @IsOptional()
  homeTeamScore?: number | null;

  @IsNumber()
  @Min(0)
  @IsOptional()
  awayTeamScore?: number | null;

  @IsEnum(MatchStatus)
  @IsOptional()
  status?: MatchStatus;
}
