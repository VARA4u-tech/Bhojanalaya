import { Router } from 'express';
import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Get all restaurants
router.get('/', async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('restaurants')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ restaurants: data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch restaurants' });
    }
});

// Get restaurant by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('restaurants')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json({ restaurant: data });
    } catch (error) {
        res.status(404).json({ error: 'Restaurant not found' });
    }
});

// Create restaurant (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('restaurants')
            .insert([req.body])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ restaurant: data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create restaurant' });
    }
});

// Update restaurant (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('restaurants')
            .update(req.body)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ restaurant: data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update restaurant' });
    }
});

// Delete restaurant (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { error } = await supabaseAdmin
            .from('restaurants')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete restaurant' });
    }
});

export default router;
