import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import Content from '../models/content.model.js';
import mongoose from 'mongoose'

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
    const role = req.query.role; // Get role from query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments({ role: role });
    const users = await User.find({ role: role }).skip(skip).limit(limit);

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

export const subscribedStudents = asyncHandler(async (req, res) => {

    const { courseId } = req.body;

    if (!courseId) {
        res.status(400);
        throw new Error('Course ID is required');
    }

    const course = await Content.findById(courseId);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    const students = await User.find({
        _id: { $in: course.purchasedBy }
    });

    if (students.length === 0) {
        return res.status(404).json({ message: 'No subscribed students found for this course' });
    }

    return res.status(200).json({ message: 'Subscribed students fetched successfully', students });
});

export const getTeachersStats = asyncHandler(async (req, res) => {
    const teachersMonthlyStats = await Content.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.id),
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: "_id",
                as: 'createdBy'
            }
        },
        { $unwind: '$createdBy' },
        {
            $project: {
                purchasedByCount: { $size: "$purchasedBy" },
                createdByName: "$createdBy.name",
                title: 1,
                price: { $toInt: "$price" },
                revenue: {
                    $multiply: [
                        { $toInt: "$price" },
                        { $size: "$purchasedBy" }
                    ]
                },
                month: { $dateToString: { format: "%B", date: "$createdAt" } }
            }
        },
        {
            $facet: {
                monthly: [
                    {
                        $group: {
                            _id: { teacher: "$createdByName", month: "$month" },
                            totalCourses: { $sum: 1 },
                            totalPurchases: { $sum: "$purchasedByCount" },
                            totalRevenue: { $sum: "$revenue" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            createdBy: "$_id.teacher",
                            month: "$_id.month",
                            totalCourses: 1,
                            totalPurchases: 1,
                            totalRevenue: 1
                        }
                    },
                    { $sort: { month: 1 } }
                ],
                totals: [
                    {
                        $group: {
                            _id: "$createdByName",
                            totalCourses: { $sum: 1 },
                            totalPurchases: { $sum: "$purchasedByCount" },
                            totalRevenue: { $sum: "$revenue" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            createdBy: "$_id",
                            totalCourses: 1,
                            totalPurchases: 1,
                            totalRevenue: 1
                        }
                    }
                ]
            }
        }
    ]);
    return res.json(teachersMonthlyStats)
})

export const getAdminStats = asyncHandler(async (req, res) => {
    // ---- USERS AGGREGATION ----
    const usersStats = await User.aggregate([
        {
            $match: { role: { $in: ["student", "teacher"] } },
        },
        {
            $project: {
                role: 1,
                monthNum: { $month: "$createdAt" },
                monthName: { $dateToString: { format: "%b", date: "$createdAt" } }, // Jan, Feb, ...
            },
        },
        {
            $group: {
                _id: { role: "$role", monthNum: "$monthNum", monthName: "$monthName" },
                count: { $sum: 1 },
            },
        },
        {
            $facet: {
                monthly: [
                    {
                        $project: {
                            _id: 0,
                            role: "$_id.role",
                            month: "$_id.monthName",
                            monthNum: "$_id.monthNum",
                            count: 1,
                        },
                    },
                    { $sort: { monthNum: 1 } },
                    { $project: { monthNum: 0 } },
                ],
                totals: [
                    {
                        $group: {
                            _id: "$_id.role",
                            count: { $sum: "$count" },
                        },
                    },
                    { $project: { _id: 0, role: "$_id", count: 1 } },
                ],
            },
        },
    ]);

    // ---- CONTENTS AGGREGATION ----
    const contentsStats = await Content.aggregate([
        {
            $project: {
                price: { $toInt: "$price" },
                purchasedByCount: { $size: "$purchasedBy" },
                monthNum: { $month: "$createdAt" },
                monthName: { $dateToString: { format: "%b", date: "$createdAt" } },
            },
        },
        {
            $addFields: {
                revenue: { $multiply: ["$price", "$purchasedByCount"] },
            },
        },
        {
            $facet: {
                monthly: [
                    {
                        $group: {
                            _id: { monthNum: "$monthNum", monthName: "$monthName" },
                            totalCourses: { $sum: 1 },
                            totalPurchases: { $sum: "$purchasedByCount" },
                            totalRevenue: { $sum: "$revenue" },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            month: "$_id.monthName",
                            monthNum: "$_id.monthNum",
                            totalCourses: 1,
                            totalPurchases: 1,
                            totalRevenue: 1,
                        },
                    },
                    { $sort: { monthNum: 1 } },
                    { $project: { monthNum: 0 } },
                ],
                totals: [
                    {
                        $group: {
                            _id: null,
                            totalCourses: { $sum: 1 },
                            totalPurchases: { $sum: "$purchasedByCount" },
                            totalRevenue: { $sum: "$revenue" },
                        },
                    },
                    { $project: { _id: 0 } },
                ],
            },
        },
    ]);

    // ---- FORMAT RESPONSE ----
    const totals = usersStats[0].totals;
    const studentTotal = totals.find((t) => t.role === "student")?.count || 0;
    const teacherTotal = totals.find((t) => t.role === "teacher")?.count || 0;

    const contentTotals = contentsStats[0].totals[0] || {
        totalCourses: 0,
        totalRevenue: 0,
    };

    const stats = [
        {
            title: "Total Students",
            value: studentTotal.toLocaleString(),
            color: "from-indigo-500 to-purple-600",
        },
        {
            title: "Total Teachers",
            value: teacherTotal.toLocaleString(),
            color: "from-emerald-500 to-teal-600",
        },
        {
            title: "Total Courses",
            value: contentTotals.totalCourses.toLocaleString(),
            color: "from-pink-500 to-rose-600",
        },
        {
            title: "Total Transactions",
            value: contentTotals.totalRevenue,
            color: "from-yellow-500 to-orange-600",
        },
    ];

    // ---- BUILD CHART DATA WITH ALL 12 MONTHS ----
    const monthlyUsers = usersStats[0].monthly;
    const monthlyContent = contentsStats[0].monthly;

    const monthOrder = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const chartData = monthOrder.map((month) => {
        const students =
            monthlyUsers.find((u) => u.role === "student" && u.month === month)
                ?.count || 0;
        const teachers =
            monthlyUsers.find((u) => u.role === "teacher" && u.month === month)
                ?.count || 0;
        const courses =
            monthlyContent.find((c) => c.month === month)?.totalCourses || 0;
        const revenue =
            monthlyContent.find((c) => c.month === month)?.totalRevenue || 0;

        return { month, students, teachers, courses, revenue };
    });

    return res.json({ stats, chartData });
});

// @desc   Get paginated list of contents created by the logged-in teacher
// @route  GET /api/users/teacher/contents
// @access Private/Teacher
export const teacherContents = asyncHandler(async (req, res) => {
    if (req.user.role !== 'teacher') {
        res.status(403);
        throw new Error('Access denied. Only teachers can access this route.');
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalContents = await Content.countDocuments({ createdBy: req.user.id });
    const contents = await Content.find({ createdBy: req.user.id }).skip(skip).limit(limit);

    res.status(200).json({
        message: 'Contents fetched successfully',
        contents,
        pagination: {
            totalContents,
            currentPage: page,
            totalPages: Math.ceil(totalContents / limit),
            pageSize: limit,
        },
    });
});

// @desc   Get user details by ID
// @route  GET /api/users/:id
// @access Private/Admin
export const userDetail = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({ message: 'User details fetched successfully', user });
}); 
