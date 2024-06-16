import mongoose from './index.js'


const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,'Title is required'],
    },
    description: {
        type: String,
        required: [true,'Description is required']
    },
    tn: {
        type: String
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    studentName: {
        type: String,
    },
    studentEmail: {
        type: String,
    },
    status: {
        type: String,
        default: 'Open'
    },
    createdAt: {
        type: Date,
        default: () => new Date
    },
    assignedTo: {
        type: String,
        default: null
    },
    assignedToId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    assignedAt: {
        type: Date,
        default: null
    },
    closedAt: {
        type: Date,
        default: null
    },
    resolution: {
        type: String,
        default: null
    }
},{
    collection:'ticket',
    versionKey: false
})


const ticketModel = mongoose.model('ticket',ticketSchema)


export default ticketModel