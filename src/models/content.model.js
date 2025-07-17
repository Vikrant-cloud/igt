import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    media: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

const Content = mongoose.model('Content', contentSchema);

export default Content;