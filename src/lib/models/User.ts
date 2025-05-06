import { model, models, ObjectId, Schema, Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type ImageSchema = {
  url: string;
  path: string;
};

type UserSchema = {
  fullname: string;
  phone: string;
  wallet: number;
  role: Role;
  image?: ImageSchema;
  cart: ObjectId[];
};

export const imageSchema = new Schema<ImageSchema>({
  path: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const schema = new Schema<UserSchema>(
  {
    fullname: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    wallet: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: imageSchema,
      required: false,
    },
    cart: {
      type: [{ type: Types.ObjectId, ref: "Course" }],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

const User = models?.User || model<UserSchema>("User", schema);
export default User;
