import mongoose from "./index.js"


const chatSchema = new mongoose.Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ticket'
    },
    sender: {
        type: String,
        enum: ['mentor','student'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    collection:'chat',
    versionKey: false
})


const chatModel = mongoose.model('chat',chatSchema)


export default chatModel