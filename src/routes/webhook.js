import express from 'express';
import Stripe from 'stripe';
import User from '../models/user.model.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const data = event.data.object;

    switch (event.type) {
        case 'checkout.session.completed': {
            const paymentIntent = await stripe.paymentIntents.retrieve(data.payment_intent);
            const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent.payment_method);

            await User.findOneAndUpdate(
                { stripeCustomerId: data.customer },
                { paymentMethod: paymentMethod.type }
            );
            break;
        }

        case 'invoice.payment_succeeded': {
            await User.findOneAndUpdate(
                { stripeCustomerId: data.customer },
                {
                    subscriptionStatus: 'active',
                    currentPeriodEnd: new Date(data.lines.data[0].period.end * 1000),
                }
            );
            break;
        }

        case 'invoice.payment_failed': {
            await User.findOneAndUpdate(
                { stripeCustomerId: data.customer },
                { subscriptionStatus: 'past_due' }
            );
            break;
        }

        case 'customer.subscription.deleted': {
            await User.findOneAndUpdate(
                { stripeCustomerId: data.customer },
                { subscriptionStatus: 'canceled' }
            );
            break;
        }
    }

    res.json({ received: true });
});

export default router;
