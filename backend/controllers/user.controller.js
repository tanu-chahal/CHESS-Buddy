import User from "../models/user.model.js"
import createError from "../utils/createError.js"

export const Update = async (req,res)=>{
    try{
        const user = await User.findOneAndUpdate({_id: req.userId},{
            $set:{
                img: req.body.img,
            }
        })
        const {password, ...info} = user._doc
        res.status(200).send(info)
    }catch(err){
        next(err)
    }
}