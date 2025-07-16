import express from 'express';
import upload from '../utils/upload.js';
import { verifyUser } from '../middleware/verifyUser.js'

const router = express.Router();

router.post('/upload', verifyUser, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Optionally store file info in DB here
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        public_id: req.file.filename,
        url: req.file.path,
        mimetype: req.file.mimetype,
        originalname: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({ message: error || 'Upload failed' });
  }
});

export default router;
