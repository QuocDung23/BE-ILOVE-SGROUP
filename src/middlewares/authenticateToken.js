import jwt from 'jsonwebtoken';
import UserModel from '../models/users.model.js';
import { signJwt } from '../service/jwt.sign.js';

const authenticateToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Không có token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY || 'your_jwt_secret');
        console.log('Decoded token:', decoded);
        req.user = {
            _id: decoded._id,
            role: decoded.role,
            name: decoded.name,
        };
        console.log('req.user:', req.user);
        next();
    } catch (error) {
        return res.status(401).json({ message: error.message || 'token không hợp lệ' });
    }
};

export default authenticateToken;