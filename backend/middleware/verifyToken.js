import createError from "../utils/createError.js"
import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) =>{
    const token = req.cookies.accessToken
    if(!token) return next(createError(401,"You're not logged in."))

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload)=>{
        if(err) return next(createError(403, "Token is not valid."))
        req.userId = payload.id
        req.userEmail = payload.email
        next()
    })
}