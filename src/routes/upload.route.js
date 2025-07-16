const express = require('express');
const { default: upload } = require('../utils/upload');
const router = express.Router();

router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // Optionally store file info in DB here
    res.json({
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    res.json({ message: error.response.message })
  }

});

module.exports = router;
