import User from "../models/user.model.js"

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User data", user });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

export const editUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role, isActive } = req.body;
    const imageUrl = req.file.path;
    try {
        const user = await User.findByIdAndUpdate(id, { name, email, role, isActive }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
}

export const usersList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default: page 1
        const limit = parseInt(req.query.limit) || 10; // Default: 10 users per page
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments();
        const users = await User.find().skip(skip).limit(limit);

        res.status(200).json({
            message: "User list",
            users,
            pagination: {
                totalUsers,
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit),
                pageSize: limit,
            },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching user list" });
    }
};


