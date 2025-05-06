import { models, model, Schema, ObjectId, Types } from "mongoose";

enum EntityType {
  BLOG = "Blog",
  COURSE = "Course",
}

type CommentSchema = {
  text: string;
  isAccept: boolean;
  isAnswer: boolean;
  user: ObjectId;
  parentId: ObjectId;
  entityId: ObjectId;
  entityType: EntityType;
};

const commentSchema = new Schema<CommentSchema>(
  {
    text: {
      type: String,
      required: true,
    },
    isAccept: {
      type: Boolean,
      required: true,
      default: false,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: undefined,
    },
    entityType: {
      type: String,
      enum: Object.values(EntityType),
      required: true,
    },
    entityId: {
      type: Types.ObjectId,
      required: true,
      refPath: "entityType",
    },
    isAnswer: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Comment = models.Comment || model("Comment", commentSchema);
export default Comment;
