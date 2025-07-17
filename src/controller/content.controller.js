import Content from '../models/content.model.js'
import { contentSchema } from '../utils/validations.js'

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
        const page = parseInt(req.query.page) || 1; // Default: page 1
        const limit = parseInt(req.query.limit) || 10; // Default: 10 users per page
        const skip = (page - 1) * limit;

        const totalContent = await Content.countDocuments();
        const contents = await Content.find().skip(skip).limit(limit);

        res.status(200).json({
            message: "Content list",
            contents,
            pagination: {
                totalContent,
                currentPage: page,
                totalPages: Math.ceil(totalContent / limit),
                pageSize: limit,
            },
        });
    } catch (error) {
        console.error("Error fetching content:", error);
        res.status(500).json({ message: "Error fetching content list" });
    }
};