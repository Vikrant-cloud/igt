import User from "../models/user.model.js"
import jwt from 'jsonwebtoken';
import transporter from "../utils/nodemailer.js";
import { userSchema } from "../utils/validations.js";

// genrate token
const generateToken = (userId, userRole) => {
    return jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Login user flow
export const loginUser = async (req, res) => {
    const userExist = await User.findOne({ email: req.body.email, role: req.body.role }).select('+password')

    // check existed user and compare password with db
    if (!userExist || !(await userExist.comparePassword(req.body.password))) {
        return res.status(200).json({ message: 'Wrong credentials' });
    }

    try {
        const token = generateToken(userExist._id, userExist.role);
        res.cookie('token', token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production', // 🔐 Only HTTPS in production
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.status(200).json({ message: 'User logged in successfully', userExist, token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const createUser = async (req, res) => {
    const { error } = userSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const userExist = await User.findOne({ email: req.body.email })

    if (userExist) {
        return res.status(200).json({ message: 'User already exist' });
    }
    await User.create({ ...req.body })
    try {
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production', // 🔐 Only HTTPS in production
            sameSite: 'Lax',
        });
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // genrate token for reset password
    const token = generateToken(user._id, user.role);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    try {
        await transporter.sendMail({
            to: email,
            subject: 'Reset Your Password',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        });

        return res.json({ message: 'Reset link sent' });
    } catch (error) {
        console.log("Error sending email:", error);

        return res.status(500).json({ message: 'Something went wrong' });
    }

}

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = newPassword
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
}
