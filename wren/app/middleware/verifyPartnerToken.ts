import {getPartnerByPhoneNumber} from '../services/partner';
import CryptoJS from 'crypto-js';

const JWT_SECRET = process.env.PARTNER_TOKEN;

// Middleware to verify partner access token
export async function verifyPartnerToken (req, res, next){

    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    const mobile = CryptoJS.AES.decrypt(token, JWT_SECRET);
    
    const partner = await getPartnerByPhoneNumber(mobile.toString(CryptoJS.enc.Utf8));

    if (!partner) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.partnerId = partner.id;
    
    next();
};