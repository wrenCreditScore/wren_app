import * as authService from '../services/auth_service';

export async function login(req, res) {

    const body = req.body;

    try {
        const data = await authService.login(body);

        res.status(201).json({ 'data': data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function register(req, res) {

    const body = req.body;

    try {
        const data = await authService.register(body);
        
        res.status(201).json({ 'data': data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
} 