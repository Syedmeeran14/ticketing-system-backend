import chatModel from '../models/chats.js'

// Used in ChatBox.jsx
const sendMessage = async(req,res) => {
    try {

        const { ticketId, sender, message } = req.body

        const chatMessage = new chatModel({ ticketId, sender, message })
        await chatMessage.save()

        res.status(201).send(chatMessage)

    } catch(error) {
        res.status(500).send({
            message: error.message || 'Internal Server Error'
        })
    }
}


// Used in ChatBox.jsx
const getMessagesByTicketId = async(req,res) => {
    try {

        const messages = await chatModel.find({ticketId: req.params.ticketId}).sort('createdAt')

        res.status(200).send(messages)

    } catch(error) {
        res.status(500).send({
            message: error.message || 'Internal Server Error'
        })
    }
}

export default {
    sendMessage,
    getMessagesByTicketId
}