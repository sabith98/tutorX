import mongoose from "mongoose";

export interface IRating extends mongoose.Document {
  rating: number;
  comment?: string;
  tutor: mongoose.Schema.Types.ObjectId;
  learner: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new mongoose.Schema<IRating>(
  {
    rating: {
      type: Number,
      required: [true, "Please add a rating"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: [500, "Comment cannot be more than 500 characters"],
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RatingModel = mongoose.model<IRating>("Rating", ratingSchema);
