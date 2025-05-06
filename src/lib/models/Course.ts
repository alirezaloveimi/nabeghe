import { Types, ObjectId, models, model, Schema } from "mongoose";
import { imageSchema } from "./User";

enum CourseStatus {
  PRESALE = "PRESALE",
  COMPLATE = "COMPLATE",
  INPROGRESS = "INPROGRESS",
}

type CourseSchema = {
  title: string;
  description: string;
  price: number;
  discount: number;
  time: number;
  html: string;
  cover: ImageT;
  teacher: ObjectId;
  category: ObjectId;
  status: CourseStatus;
  students: ObjectId[];
};

const courseSchema = new Schema<CourseSchema>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    teacher: {
      type: Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    time: {
      type: Number,
      required: true,
      default: 0,
    },
    cover: {
      type: imageSchema,
      required: true,
    },
    html: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CourseStatus),
      default: CourseStatus.PRESALE,
    },
    students: {
      type: [{ type: Types.ObjectId, ref: "User" }],
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

const Course = models.Course || model("Course", courseSchema);
export default Course;
