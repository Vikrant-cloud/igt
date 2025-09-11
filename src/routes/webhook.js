import express from 'express';
import Stripe from 'stripe';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import Content from '../models/content.model.js'

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
    '/',
    asyncHandler(async (req, res) => {
        const sig = req.headers['stripe-signature'];

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error('❌ Webhook signature error:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        console.log(event, "event");


        try {
            if (event.type === "checkout.session.completed") {
                const session = event.data.object;

                const { courseId, userId } = session.metadata;

                // update purchasedBy after successful payment
                const course = await Content.findById(courseId);
                if (course && !course.purchasedBy.includes(userId)) {
                    course.purchasedBy.push(userId);
                    await course.save();
                }

                // you can also update user record if needed
                await User.findByIdAndUpdate(userId, {
                    $addToSet: { purchasedCourses: courseId }
                });
            }

            res.status(200).json({ received: true });
        } catch (error) {
            console.error(`❌ Error handling ${event.type}:`, error);
            res.status(500).json({ error: 'Webhook internal error' });
        }
    })
);

export default router;
