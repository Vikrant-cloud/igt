import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            index: true, // optional if not filtering/sorting directly
        },
        media: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// ✅ Full-text search (only one allowed per collection)
contentSchema.index({ title: 'text', description: 'text', subject: 'text' });

// ✅ Sort & paginate by user and creation date
contentSchema.index({ createdBy: 1, createdAt: -1 });

// ✅ Sort by recent content
contentSchema.index({ createdAt: -1 });

const Content = mongoose.model('Content', contentSchema);
export default Content;
