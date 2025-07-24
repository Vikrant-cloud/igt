import asyncHandler from 'express-async-handler';
import stripe from '../utils/stripe.js';
import User from '../models/user.model.js';

// @desc   Create Stripe Checkout session for subscription
// @route  POST /api/subscription/create-checkout-session
// @access Public
export const createCheckoutSession = asyncHandler(async (req, res) => {
    const { email } = req.body;

    let user = await User.findOne({ email });

    // If customer not yet created in Stripe
    if (!user.stripeCustomerId) {
        const customer = await stripe.customers.create({ email });
        user.stripeCustomerId = customer.id;
        await user.save();
    }

    // Create Checkout session
    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: user.stripeCustomerId,
        line_items: [
            {
                price: process.env.STRIPE_PRICE_ID, // secure & dynamic
                quantity: 1,
            },
        ],
        success_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.status(200).json({ url: session.url });
});
