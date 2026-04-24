import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TeamDocument = HydratedDocument<TeamSchema>;

@Schema({
  collection: 'teams',
  timestamps: true,
})
export class TeamSchema {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  })
  isoCode!: string;

  @Prop({
    required: true,
    trim: true,
  })
  flagEmoji!: string;
}

export const TeamSchemaFactory = SchemaFactory.createForClass(TeamSchema);
