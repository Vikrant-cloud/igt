import express from 'express';
import { verifyUser } from '../middlewares/verifyUser.js';
import { verifyAdmin } from '../middlewares/verifyAdmin.js';
import upload from '../utils/upload.js';
import { contentList, createContent, contentUpdate, deleteContent, homeContentList, approveCourse, myCourses, getContentById } from '../controller/content.controller.js';

const router = express.Router();

router.post('/create-content', verifyUser, upload.array("media"), createContent);
router.put('/:id', verifyUser, upload.single('media'), contentUpdate);
router.delete('/:id', verifyUser, deleteContent);
router.get('/', verifyUser, contentList);
router.get('/home-content', verifyUser, homeContentList);
router.post('/approve/:id', verifyUser, verifyAdmin, approveCourse);
router.get('/my-courses', verifyUser, myCourses);
router.get('/course/:id', verifyUser, getContentById);

export default router;
