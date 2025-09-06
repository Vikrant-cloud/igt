import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true }, // courseId or chat room
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // teacher or student
    text: { type: String, required: true },
    type: { type: String, enum: ["chat", "ai"], default: "chat" },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
