import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String
    },
    reciever: {
      type: String
    },
    message: {
      type: String
    },
  },
  {
    timestamps: true
  }
)

const Message = mongoose.Model('Message', MessageSchema)

export default Message