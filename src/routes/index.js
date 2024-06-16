import express from 'express'
import ticketRouter from './tickets.js'
import userRouter from './users.js'
import chatRouter from './chats.js'


const router = express.Router()

router.use('/ticket',ticketRouter)
router.use('/user',userRouter)
router.use('/chat',chatRouter)



export default router