import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StadiumDocument = HydratedDocument<StadiumSchema>;

@Schema({ _id: false })
export class MidiaSchema {
  @Prop({
    required: true,
    trim: true,
  })
  photoUrl!: string;
}

@Schema({
  collection: 'stadiums',
  timestamps: true,
})
export class StadiumSchema {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: true,
    trim: true,
  })
  city!: string;

  @Prop({
    required: false,
    min: 0,
  })
  capacity?: number;

  @Prop({
    required: true,
    type: MidiaSchema,
  })
  midia!: MidiaSchema;
}

export const StadiumSchemaFactory = SchemaFactory.createForClass(StadiumSchema);
