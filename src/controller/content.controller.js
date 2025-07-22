import Content from '../models/content.model.js'
import { contentSchema } from '../utils/validations.js'
import mongoose from 'mongoose';

export const createContent = async (req, res) => {
    const media = req.file.path
    const { error } = contentSchema.validate({ ...req.body, media });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        const content = await Content.create({ ...req.body, media })
        return res.status(201).json({ message: 'Content created successfully', content });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const contentList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // default to page 1
        const limit = parseInt(req.query.limit) || 10; // default to 10 per page
        const skip = (page - 1) * limit;

        // Total count without pagination (for frontend to calculate total pages)
        const totalCount = await Content.countDocuments();

        const matchStage = req.user.role === 'user'
            ? { $match: { createdBy: new mongoose.Types.ObjectId(req.user.id) } }
            : { $match: {} };


        const content = await Content.aggregate([
            matchStage,
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdBy'
                }
            },
            { $unwind: '$createdBy' },
            {
                $project: {
                    title: 1,
                    description: 1,
                    media: 1,
                    createdAt: 1,
                    'createdBy.name': 1
                }
            },
            { $sort: { createdAt: -1 } }, // newest first
            { $skip: skip },
            { $limit: limit }
        ]);

        res.status(200).json({
            contents: content,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: 'Error fetching content with user info', error });
    }
};


export const contentUpdate = async (req, res) => {
    const { id } = req.params;
    let media
    if (req.file) {
        media = req.file.path
        req.body = { ...req.body, media }
    }

    const { error } = contentSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        const content = await Content.findByIdAndUpdate(id, req.body, { new: true });
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        return res.status(200).json({ message: 'Content updated successfully', content });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteContent = async (req, res) => {
    try {
        const content = await Content.findByIdAndDelete(req.params.id);

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        res.status(200).json({ message: 'Content deleted successfully', content });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting content', error });
    }
};

export const homeContentList = async (req, res) => {
    try {
        const content = await Content.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdBy'
                }
            },
            { $unwind: '$createdBy' },
            {
                $project: {
                    title: 1,
                    description: 1,
                    media: 1,
                    createdAt: 1,
                    'createdBy.name': 1
                }
            },
            { $sort: { createdAt: -1 } }, // newest first
            { $limit: 10 } // limit to 10 items
        ]);

        res.status(200).json({ contents: content });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching home content', error });
    }
}