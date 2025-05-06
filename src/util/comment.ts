import { connectDB } from "@/lib/config/db";
import Comment from "@/lib/models/Comment";
import "@/lib/models/User";
import "@/lib/models/Course";
import "@/lib/models/Blog";

async function repliesHandler(comments: CommentT[]) {
  const commentsWithReplay = await Promise.all(
    comments.map(async (comment) => {
      const replies = await Comment.find({
        parentId: comment._id,
        isAnswer: true,
      })
        .populate("user", "fullname image role")
        .lean<CommentT[]>();

      return { ...comment, replies };
    })
  );

  return commentsWithReplay;
}

export async function getCommentById(id: string, type: EntityType) {
  try {
    await connectDB();
    const comments = await Comment.find({
      entityId: id,
      isAccept: true,
      parentId: undefined,
      entityType: type,
    })
      .populate("user", "fullname image role")
      .sort({ createdAt: -1 })
      .lean<CommentT[]>();

    const commentsWithReplay = await repliesHandler(comments);
    return commentsWithReplay;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function getAllComments() {
  try {
    await connectDB();
    const comments = await Comment.find({
      parentId: undefined,
    })
      .sort({ createdAt: -1 })
      .populate("user", "fullname image role")
      .populate("entityId")
      .lean<CommentT[]>();

    const commentsWithReplay = await repliesHandler(comments);
    return commentsWithReplay;
  } catch (e) {
    console.log(e);
    return [];
  }
}
