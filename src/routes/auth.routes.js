import express from 'express';
import {
  loginUser,
  createUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from '../controller/auth.controller.js';

import { verifyUser } from '../middlewares/verifyUser.js';
import validate from '../middlewares/validate.js';
import { userSchema, resetPasswordSchema } from '../utils/validations.js';

const router = express.Router();

// Auth Routes
router.post('/login', loginUser);
router.post('/signup', validate(userSchema), createUser);
router.post('/logout', verifyUser, logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;
