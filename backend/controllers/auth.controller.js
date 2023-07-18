import User from "../models/user.model.js"
import createError from "../utils/createError.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Login = async (req, res, next)=>{
    try{
        if(req.body.password.length <8 ) return next(createError(400, "Password length must be minimum 8 characters"))

        const user = await User.findOne({email: req.body.email})
        if(!user) return next(createError(404, "User Not Found!"))

        const isCorrect = bcrypt.compareSync(req.body.password, user.password)
        if(!isCorrect) return next(createError(400, "Incorrect Email Or Password!"))

        const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET_KEY)

        const {password, ...info} = user._doc

        const oneDay = 1000 * 60 * 60 * 24;
        
        res.cookie("accessToken", token, {httpOnly: true, sameSite: "none", secure: true, expires: new Date(Date.now() + oneDay)}).status(200).send(info)
    }catch(error){ next(error) }
}

export const Register = async (req, res, next) => {
    try{
        if(req.body.password.length <8 ) return next(createError(400, "Password length must be minimum 8 characters"))
        const hash = bcrypt.hashSync(req.body.password,5)
        const newUser = new User({...req.body,
        password: hash})

        await newUser.save()
        res.status(201).json({newUser})

    }catch(error){ console.log(error) 
        next(error) }
}

export const Logout = async (req, res) =>{
    res.clearCookie("accessToken",{
        sameSite: "none",
        secure: true,
    }).status(200).send("Logged Out Successfully.");
}
