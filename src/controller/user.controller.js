import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import Content from '../models/content.model.js';
import { trusted } from 'mongoose';

// @desc   Get logged-in user's profile
// @route  GET /api/users/profile
// @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({ message: 'User profile fetched successfully', user });
});

// @desc   Edit user
// @route  PUT /api/users/:id
// @access Private
export const editUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Attach uploaded file path if available
    if (req.file && req.file.path) {
        req.body.profilePicture = req.file.path;
    }

    const user = await User.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({ message: 'User updated successfully', user });
});

// @desc   Delete user and their content
// @route  DELETE /api/users/:id
// @access Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    await Content.deleteMany({ createdBy: user._id });

    res.status(200).json({ message: 'User and their content deleted successfully' });
});

// @desc   Get paginated list of users
// @route  GET /api/users
// @access Private/Admin
export const usersList = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();
    const users = await User.find().skip(skip).limit(limit);

    res.status(200).json({
        message: 'Users fetched successfully',
        users,
        pagination: {
            totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            pageSize: limit,
        },
    });
});

export const approveUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { isVerified: true });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    return res.status(200).json({ message: 'User approved successfully' });
})
