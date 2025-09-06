import express from 'express';
import { createCheckoutSession } from '../controller/payment.controller.js';
import { verifyUser } from '../middlewares/verifyUser.js';

const router = express.Router();

router.post('/create-checkout-session', verifyUser, createCheckoutSession);

export default router;
