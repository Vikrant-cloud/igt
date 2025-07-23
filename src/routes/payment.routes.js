import express from 'express';
import Stripe from 'stripe';
import User from '../models/user.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
    const { email } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
        const customer = await stripe.customers.create({ email });
        user = await User.create({ email, stripeCustomerId: customer.id });
    }

    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: user.stripeCustomerId,
        line_items: [{ price: 'price_1Ro8JTEKxq3WP4BjeL4ppFD9', quantity: 1 }],
        success_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ url: session.url });
});

export default router;
