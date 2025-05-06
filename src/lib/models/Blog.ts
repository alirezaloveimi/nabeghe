import { Schema, models, model, ObjectId, Types } from "mongoose";
import { ImageSchema, imageSchema } from "./User";

type BlogSchema = {
  title: string;
  description: string;
  author: string;
  html: string;
  cover: ImageSchema;
  likes: ObjectId[];
};

const schema = new Schema<BlogSchema>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    html: {
      type: String,
      required: true,
    },
    cover: {
      type: imageSchema,
      required: true,
    },
    likes: {
      type: [{ type: Types.ObjectId, ref: "User" }],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

const Blog = models?.Blog || model<BlogSchema>("Blog", schema);
export default Blog;
