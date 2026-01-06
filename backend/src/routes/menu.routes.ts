import { Router } from 'express';
import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// Get menu items by restaurant
router.get('/restaurant/:restaurantId', async (req: Request, res: Response) => {
    try {
        const { restaurantId } = req.params;

        const { data, error } = await supabaseAdmin
            .from('menu_items')
            .select('*')
            .eq('restaurant_id', restaurantId);

        if (error) throw error;

        res.json({ menuItems: data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
});

// Get menu item by ID
router.get('/item/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('menu_items')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        res.json({ menuItem: data });
    } catch (error) {
        res.status(404).json({ error: 'Menu item not found' });
    }
});

// Create menu item (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('menu_items')
            .insert([req.body])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ menuItem: data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create menu item' });
    }
});

// Update menu item (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabaseAdmin
            .from('menu_items')
            .update(req.body)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        res.json({ menuItem: data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update menu item' });
    }
});

// Delete menu item (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { error } = await supabaseAdmin
            .from('menu_items')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
});

export default router;
