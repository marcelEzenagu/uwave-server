import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      // delete ret.id;
      delete ret.__v;
      return ret;
    },
  },
  timestamps: true,
})
export class Donation {
  @Prop({ type: Number })
  amount: number;

  @Prop({ type: String })
  frequency: string;
  @Prop({ type: String })
  url: string;

  @Prop({ type: String })
  firstName: string;
  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  address: string;
  @Prop({ type: String })
  city: string;

  @Prop({ type: String })
  state: string;

  @Prop({ type: String })
  status: string;

  @Prop({ type: String })
  paymentIntentID: string;

  @Prop({ type: String })
  clientSecret: string;

  @Prop({ type: Boolean })
  isAnonymous: boolean;
}

export type DonationDocument = Donation & Document;
export const DonationSchema = SchemaFactory.createForClass(Donation);
