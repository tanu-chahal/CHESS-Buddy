import mongoose from'mongoose'
import validator from 'validator'
const {Schema} = mongoose

const userSchema = new Schema({
    fullName: {
        type: String,
        required: [true,"Please provide your full name"],
        maxlength: [30, 'Name can not be more than 30 characters'],
    },
    email: {
        type: String,
        required: [true,"Please provide your email"],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email',
          },
    },
    password: {
        type: String,
        required: [true,"Please provide password"],
    },
    img: {
        type: String,
    },

},{
    timestamps: true
})

export default mongoose.model('User', userSchema)