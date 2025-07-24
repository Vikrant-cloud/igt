import express from 'express';
import Stripe from 'stripe';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';

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

        const data = event.data.object;

        try {
            switch (event.type) {
                case 'checkout.session.completed': {
                    const customerId = data.customer;
                    const subscriptionId = data.subscription;

                    await User.findOneAndUpdate(
                        { stripeCustomerId: customerId },
                        {
                            subscriptionStatus: 'active',
                            stripeSubscriptionId: subscriptionId,
                        }
                    );
                    break;
                }

                case 'invoice.payment_succeeded': {
                    await User.findOneAndUpdate(
                        { stripeCustomerId: data.customer },
                        {
                            subscriptionStatus: 'active',
                            currentPeriodEnd: new Date(
                                data.lines.data[0].period.end * 1000
                            ),
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

                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            res.status(200).json({ received: true });
        } catch (error) {
            console.error(`❌ Error handling ${event.type}:`, error);
            res.status(500).json({ error: 'Webhook internal error' });
        }
    })
);

export default router;
