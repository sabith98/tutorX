
import mongoose from 'mongoose';

export interface IPost extends mongoose.Document {
  title: string;
  description: string;
  author: mongoose.Schema.Types.ObjectId;
  videoUrl: string;
  thumbnailUrl: string;
  likes: number;
  comments: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'Please add a video URL'],
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Please add a thumbnail URL'],
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const PostModel = mongoose.model<IPost>('Post', postSchema);
