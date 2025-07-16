import express from 'express';
import {
    loginUser,
    createUser,
    logoutUser,
    forgotPassword,
    resetPassword
} from '../controller/auth.controller.js';

import { verifyUser } from '../middleware/verifyUser.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', createUser);
router.post('/logout', verifyUser, logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
