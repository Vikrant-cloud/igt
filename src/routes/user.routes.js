import express from 'express';
import {
    getUserProfile,
    usersList,
    editUser,
    deleteUser,
    approveUser,
    subscribedStudents
} from '../controller/user.controller.js';

import { verifyUser } from '../middlewares/verifyUser.js';
import { verifyAdmin } from '../middlewares/verifyAdmin.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.get('/profile', verifyUser, getUserProfile);
router.get('/', verifyUser, verifyAdmin, usersList);
router.put('/:id', verifyUser, upload.single('profilePicture'), editUser);
router.delete('/:id', verifyUser, verifyAdmin, deleteUser);
router.post('/approve-request/:id', verifyUser, verifyAdmin, approveUser)
router.post('/subscribed-students', verifyUser, subscribedStudents)

export default router;
