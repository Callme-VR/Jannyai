import mongoose, { Document, Schema, Model } from "mongoose";

export interface IMessage {
  role: string;
  content: string;
  timestamp: number;
}

export interface IChat extends Document {
  name: string;
  messages: IMessage[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    name: { type: String, required: true },
    messages: [
      {
        role: { type: String, required: true },
        content: { type: String, required: true },
        timestamp: { type: Number, required: true },
      },
    ],
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

const Chat: Model<IChat> =
  mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
