import mongoose from "mongoose";

export interface IComment extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  text: string;
  author: mongoose.Schema.Types.ObjectId;
  post: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    text: {
      type: String,
      required: [true, "Please add a comment"],
      maxlength: [500, "Comment cannot be more than 500 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CommentModel = mongoose.model<IComment>("Comment", commentSchema);
