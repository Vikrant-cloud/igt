import Message from "../models/message.model.js";

// Get all messages for a course (room chat between teacher & students)
export const getCourseMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Send a message (teacher ↔ student)
export const sendMessage = async (req, res) => {
  try {
    const { roomId, text, sender, receiver } = req.body;

    const message = await Message.create({
      roomId,
      text,
      sender,
      receiver,
      type: "chat",
    });

    const populated = await message.populate([
      { path: "sender", select: "name email role" },
      { path: "receiver", select: "name email role" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Optional: Get direct chat between teacher & specific student
export const getPrivateChat = async (req, res) => {
  try {
    const { roomId, userId1, userId2 } = req.params;

    const messages = await Message.find({
      roomId,
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
