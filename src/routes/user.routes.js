import express from 'express';
import {
    getUserProfile,
    usersList,
    editUser,
    deleteUser
} from '../controller/user.controller.js';

import { verifyUser } from '../middleware/verifyUser.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.get('/profile', verifyUser, getUserProfile);
router.get('/', verifyUser, usersList);
router.put('/:id', verifyUser, upload.single('profilePicture'), editUser);
router.delete('/:id', verifyUser, deleteUser);

export default router;
