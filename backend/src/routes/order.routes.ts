import { Router } from 'express';
import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { authMiddleware, AuthRequest, adminMiddleware } from '../middleware/auth';

const router = Router();

// Get user orders
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;

        const { data, error } = await supabaseAdmin
            .from('orders')
            .select('*, restaurant:restaurants(*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ orders: data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Get order by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        const { data, error } = await supabaseAdmin
            .from('orders')
            .select('*, restaurant:restaurants(*)')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error) throw error;

        res.json({ order: data });
    } catch (error) {
        res.status(404).json({ error: 'Order not found' });
    }
});

// Create order
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const orderData = {
            ...req.body,
            user_id: userId,
            status: 'pending'
        };

        const { data, error } = await supabaseAdmin
            .from('orders')
            .insert([orderData])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ order: data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Update order status (admin only)
router.put('/:id/status', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabaseAdmin
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ order: data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

// Cancel order
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        const { data, error } = await supabaseAdmin
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;

        res.json({ message: 'Order cancelled successfully', order: data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel order' });
    }
});

export default router;
