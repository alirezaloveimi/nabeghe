import { ObjectId, Schema, Types, model, models } from "mongoose";
import { ImageSchema, imageSchema } from "./User";

type TeacherSchema = {
  name: string;
  title: string;
  about: string;
  image: ImageSchema;
  courses: ObjectId[];
};

const teacherSchema = new Schema<TeacherSchema>(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    image: {
      type: imageSchema,
      required: true,
    },
    courses: {
      type: [{ type: Types.ObjectId, ref: "Coures" }],
      required: false,
      default: [],
    },
  },
  { timestamps: true }
);

const Teacher = models.Teacher || model("Teacher", teacherSchema);
export default Teacher;
