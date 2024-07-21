import { Schema, Types, model } from "mongoose";

export interface IComment {
  userId: Types.ObjectId;
  username: string;
  laureateId: string;
  content: string;
}

// Storing user name in Comment schema for convenience
const commentSchema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    username: { type: String, required: true },
    laureateId: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Comment = model<IComment>("Comment", commentSchema);
export { Comment };
