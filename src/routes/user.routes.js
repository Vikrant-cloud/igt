import express from 'express';
import {
    getUserProfile,
    usersList,
    editUser,
    deleteUser
} from '../controller/user.controller.js';

import { verifyUser } from '../middleware/verifyUser.js';

const router = express.Router();

router.get('/profile', verifyUser, getUserProfile);
router.get('/', verifyUser, usersList);
router.post('/edit/:id', verifyUser, editUser);
router.post('/delete/:id', verifyUser, deleteUser);

export default router;
