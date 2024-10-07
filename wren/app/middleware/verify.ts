import jwt from 'jsonwebtoken';
import * as userRepo from '../repositories/user_repo';
const SECRET_TOKEN = process.env.SECRET_TOKEN;

export async function verifyToken(req, res, next) {

    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ error: 'No token provided' }); 

        jwt.verify(authHeader, SECRET_TOKEN, async (err, decoded) => {
            if (err) return res.status(401).json({ error: 'Invalid token' });

            const { id } = decoded;
            
            const user = await userRepo.getUserByID(id);

            req.user = user.data;
            next();
        })
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
}