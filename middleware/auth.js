import {verify_token} from "../utilities/jwt.js"

export function with_auth(handler){
    return async (req, res)=>{
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const decoded = verify_token(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = decoded.user; // Attach user info to request
        return handler(req,res);
    }
}