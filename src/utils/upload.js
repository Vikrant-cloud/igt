import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from './cloudnary.js';

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'user_profiles', // optional folder in your Cloudinary account
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    },
});

const upload = multer({ storage });

export default upload;