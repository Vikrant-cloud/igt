import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import transporter from '../utils/nodemailer.js';
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔐 Generate JWT token
const generateToken = (userId, userRole) => {
    return jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

// 🟢 Login User
export const loginUser = asyncHandler(async (req, res) => {
    const userExist = await User.findOne({
        email: req.body.email,
        role: req.body.role,
    }).select('+password');

    if (!userExist || !(await userExist.comparePassword(req.body.password))) {
        res.status(401); // Unauthorized
        throw new Error('Invalid credentials');
    }

    const token = generateToken(userExist._id, userExist.role);

    res.cookie('token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
        message: 'User logged in successfully',
        user: userExist,
        token,
    });
});

// 🟢 Register/Create User
export const createUser = asyncHandler(async (req, res) => {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
        res.status(409); // Conflict
        throw new Error('User already exists');
    }

    await User.create({ ...req.body });

    res.status(201).json({ message: 'User created successfully' });
});

// 🔴 Logout User
export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('token', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });

    res.status(200).json({ message: 'User logged out successfully' });
});

// 🔁 Forgot Password (Send Reset Email)
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const token = generateToken(user._id, user.role);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    try {
        await transporter.sendMail({
            to: email,
            subject: 'Reset Your Password',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        });

        res.status(200).json({ message: 'Reset link sent successfully' });
    } catch (error) {
        res.status(500);
        throw new Error('Failed to send reset email');
    }
});

// 🔁 Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters long');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(400);
        throw new Error('Invalid or expired token');
    }
});

// 🟢 Google Login
export const googleLogin = asyncHandler(async (req, res) => {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
        res.status(400);
        throw new Error("Invalid Google token");
    }

    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name,
            email,
            googleId: sub,
            profilePicture: picture,
            isVerified: true,
            role: 'user', // Default role, can be changed later
        });
    }

    const jwtToken = generateToken(user._id, user.role);

    res.cookie('token', jwtToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
        message: 'User logged in successfully',
        user,
        jwtToken,
    });
});
