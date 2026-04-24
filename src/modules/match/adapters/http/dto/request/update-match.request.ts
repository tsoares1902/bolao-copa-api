import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

import { MatchGroup } from '@src/modules/match/domain/enums/match-group.enum';
import { MatchPhase } from '@src/modules/match/domain/enums/match-phase.enum';
import { MatchStatus } from '@src/modules/match/domain/enums/match-status.enum';

export class UpdateMatchRequest {
  @IsMongoId()
  @IsOptional()
  homeTeamId?: string;

  @IsMongoId()
  @IsOptional()
  awayTeamId?: string;

  @IsMongoId()
  @IsOptional()
  stadiumId?: string;

  @IsDateString()
  @IsOptional()
  matchDate?: string;

  @IsEnum(MatchPhase)
  @IsOptional()
  phase?: MatchPhase;

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
