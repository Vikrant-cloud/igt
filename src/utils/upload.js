import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from './cloudnary.js';

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: 'media_files',
            resource_type: 'auto',
            public_id: `${Date.now()}-${file.originalname}`,
            format: file.mimetype.split('/')[1],
            allowed_formats: [
                'jpg',
                'jpeg',
                'png',
                'gif',
                'webp',
                'mp4',
                'mov',
                'avi',
                'mkv',
                'pdf',
                'doc',
                'docx',
                'xls',
                'xlsx',
                'ppt',
                'pptx',
                'txt',
                'zip',
                'rar'
            ],
        };
    },
});

const upload = multer({ storage });

export default upload;
