import mongoose from'mongoose'
const {Schema} = mongoose

const matchSchema = new Schema({
    players: {
        type: [String],
        required: true,
    },
    code:{
        type: String,
        required: true,
        unique: true,
    },
    status: { 
        type: String,
        enum: ['Finished', 'Paused', 'Cancelled'],
        default: 'Paused', 
    },
    captured:{
        type: [String],
        enum: ['♜', '♞', '♝', '♛', '♚','♟︎', '♙', '♖', '♘', '♗', '♕', '♔'],
        required: true,
    },
    winner:{
        type: String,
    }

},{
    timestamps: true
})

export default mongoose.model('Match', matchSchema)