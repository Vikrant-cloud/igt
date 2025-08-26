import asyncHandler from 'express-async-handler';
import stripe from '../utils/stripe.js';
import User from '../models/user.model.js';
import Content from '../models/content.model.js';

// @desc   Create Stripe Checkout session for subscription
// @route  POST /api/subscription/create-checkout-session
// @access Public
export const createCheckoutSession = asyncHandler(async (req, res) => {
    const { courseId } = req.body;

    // find course in DB
    const course = await Content.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: { name: course.title },
                    unit_amount: course.price * 100,
                },
                quantity: 1,
            },
        ],
        success_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        //customer_email: req.user.email,
        // metadata: { courseId: course._id, userId: req.user.id },
    });

    course.purchasedBy.push(req.user.id);
    await course.save();

    res.json({ url: session.url });
});
