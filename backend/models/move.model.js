import mongoose from'mongoose'
const {Schema} = mongoose

const moveSchema = new Schema({
    players: {
        type: [String],
        required: true,
    },
    match:{
        type: String,
        required: true,
        unique: true,
    },
    piece: { 
        type: String,
        enum: ['♜', '♞', '♝', '♛', '♚','♟︎', '♙', '♖', '♘', '♗', '♕', '♔'],
        required: true,
    },
    sourceSquare:{
        type: String,
        required: true,
    },
    targetSquare:{
        type: String,
        required: true,
    },
    isCapture:{
        type: boolean,
        required: true,
    },

},{
    timestamps: true
})

export default mongoose.model('Move', moveSchema)