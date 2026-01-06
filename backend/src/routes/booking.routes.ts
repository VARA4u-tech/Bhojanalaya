import { Router } from 'express';
import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user bookings
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;

        const { data, error } = await supabaseAdmin
            .from('bookings')
            .select('*, restaurant:restaurants(*)')
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (error) throw error;

        res.json({ bookings: data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Create booking
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const bookingData = {
            ...req.body,
            user_id: userId,
            status: 'pending'
        };

        const { data, error } = await supabaseAdmin
            .from('bookings')
            .insert([bookingData])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ booking: data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// Update booking
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        const { data, error } = await supabaseAdmin
            .from('bookings')
            .update(req.body)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;

        res.json({ booking: data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking' });
    }
});

// Cancel booking
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user!.id;

        const { data, error } = await supabaseAdmin
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;

        res.json({ message: 'Booking cancelled successfully', booking: data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
});

export default router;
