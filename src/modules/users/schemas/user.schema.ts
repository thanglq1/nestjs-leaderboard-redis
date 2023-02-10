import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, toJson: false })
  password: string;

  @Prop({ default: 0 })
  score: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
// Hide password
UserSchema.method('toJSON', function () {
  const user = this.toObject();
  delete user.password;
  return user;
});
