import express from 'express'
import chatsController from '../controllers/chats.js'
import validate from '../middlewares/Validate.js'

const router = express.Router()

router.post('/:ticketId',validate,chatsController.sendMessage)  // Used in ChatBox.jsx
router.get('/:ticketId',validate,chatsController.getMessagesByTicketId)  // Used in ChatBox.jsx


export default router