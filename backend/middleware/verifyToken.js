import createError from "../utils/createError.js"
import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(createError(401, "You're not logged in."));
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload)=>{
        if(err) return next(createError(403, "Token is not valid."))
        req.userId = payload.id
        req.userEmail = payload.email
        next()
    })
}