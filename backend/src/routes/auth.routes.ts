import { Router } from 'express';
import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { z } from 'zod';

const router = Router();

// Validation schemas
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    phone: z.string().optional()
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

// Register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name, phone } = registerSchema.parse(req.body);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    phone,
                    role: 'user'
                }
            }
        });

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(201).json({
            message: 'User registered successfully',
            user: data.user,
            session: data.session
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation failed', details: error.errors });
            return;
        }
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            res.status(401).json({ error: error.message });
            return;
        }

        res.json({
            message: 'Login successful',
            user: data.user,
            session: data.session
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation failed', details: error.errors });
            return;
        }
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout
router.post('/logout', async (req: Request, res: Response): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ error: 'No authorization token' });
            return;
        }

        authHeader.substring(7);
        const { error } = await supabase.auth.signOut();

        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        res.json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: 'Logout failed' });
    }
});

export default router;
