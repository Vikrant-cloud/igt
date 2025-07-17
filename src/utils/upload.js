import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from './cloudnary.js';

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith('video');

        return {
            folder: 'user_profiles',
            resource_type: isVideo ? 'video' : 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'mp4'],
            ...(isVideo
                ? {} // No transformation for video
                : {
                    transformation: [{ width: 500, height: 500, crop: 'limit' }],
                }),
        };
    },
});


const upload = multer({ storage });

export default upload;