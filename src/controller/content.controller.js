import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Content from '../models/content.model.js';
import { contentSchema } from '../utils/validations.js';

// @desc   Create new content
// @route  POST /api/content
// @access Private
export const createContent = asyncHandler(async (req, res) => {
    const media = req.file?.path;

    const { error } = contentSchema.validate({ ...req.body, media });
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const content = await Content.create({ ...req.body, media, createdBy: req.user.id });

    res.status(201).json({ message: 'Content created successfully', content });
});

// @desc   Get content list with pagination (user/admin view)
// @route  GET /api/content
// @access Private
export const contentList = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const matchStage =
        req.user.role === 'teacher'
            ? { $match: { createdBy: new mongoose.Types.ObjectId(req.user.id) } }
            : { $match: {} };

    const [contents, total] = await Promise.all([
        Content.aggregate([
            matchStage,
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdBy',
                },
            },
            { $unwind: '$createdBy' },
            {
                $project: {
                    title: 1,
                    description: 1,
                    subject: 1,
                    media: 1,
                    createdAt: 1,
                    'createdBy.name': 1,
                    price: 1,
                    isApproved: 1,
                },
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
        ]),
        Content.countDocuments(req.user.role === 'teacher' ? { createdBy: req.user.id } : { isApproved: true }),
    ]);

    res.status(200).json({
        contents,
        pagination: {
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            pageSize: limit,
        },
    });
});

// @desc   Update content
// @route  PUT /api/content/:id
// @access Private
export const contentUpdate = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (req.file) {
        req.body.media = req.file.path;
    }

    const { error } = contentSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const content = await Content.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!content) {
        res.status(404);
        throw new Error('Content not found');
    }

    res.status(200).json({ message: 'Content updated successfully', content });
});

// @desc   Delete content
// @route  DELETE /api/content/:id
// @access Private
export const deleteContent = asyncHandler(async (req, res) => {
    const content = await Content.findByIdAndDelete(req.params.id);

    if (!content) {
        res.status(404);
        throw new Error('Content not found');
    }

    res.status(200).json({ message: 'Content deleted successfully', content });
});

// @desc   Get recent content for home page with pagination
// @route  GET /api/content/home?page=1&limit=10
// @access Public
export const homeContentList = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [content, total] = await Promise.all([
        Content.aggregate([
            {
                $match: { isApproved: true }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdBy',
                },
            },
            { $unwind: '$createdBy' },
            {
                $project: {
                    title: 1,
                    description: 1,
                    media: 1,
                    subject: 1,
                    createdAt: 1,
                    'createdBy.name': 1,
                },
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
        ]),
        Content.countDocuments(),
    ]);

    res.status(200).json({
        contents: content,
        pagination: {
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            pageSize: limit,
        },
    });
});

export const approveCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const content = await Content.findByIdAndUpdate(id, { isApproved: true }, { new: true });

    if (!content) {
        res.status(404);
        throw new Error('Content not found');
    }

    res.status(200).json({ message: 'Course approved successfully', content });
});
