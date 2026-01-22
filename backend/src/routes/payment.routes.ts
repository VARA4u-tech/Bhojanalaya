
import { Router } from 'express';
import Stripe from 'stripe';
import { config } from '../config/env';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2025-12-15.clover', // Updated to match installed Stripe SDK version
});

router.post('/create-checkout-session', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const { items, restaurantId } = req.body;
        const userId = req.user!.id;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'No items provided' });
        }

        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : undefined,
                },
                unit_amount: Math.round(item.price * 100), // Stripe expects amount in paise/cents
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${config.frontendUrl}/order-status?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config.frontendUrl}/menu?canceled=true`,
            metadata: {
                userId,
                restaurantId,
                items: JSON.stringify(items.map((i: any) => ({ id: i.id, q: i.quantity }))).substring(0, 500),
            },
        });

        res.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
