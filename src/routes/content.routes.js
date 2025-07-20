import express from 'express';
import { verifyUser } from '../middleware/verifyUser.js';
import upload from '../utils/upload.js';
import { contentList, createContent, contentUpdate, deleteContent } from '../controller/content.controller.js';

const router = express.Router();

router.post('/create-content', verifyUser, upload.single('media'), createContent);
router.put('/:id', verifyUser, upload.single('media'), contentUpdate);
router.delete('/:id', verifyUser, deleteContent);
router.get('/', verifyUser, contentList);

export default router;
