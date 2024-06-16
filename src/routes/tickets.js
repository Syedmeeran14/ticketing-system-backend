import express from 'express'
import mentorGuard from '../middlewares/mentorGuard.js'
import studentGuard from '../middlewares/studentGuard.js'
import ticketController from '../controllers/tickets.js'
import validate from '../middlewares/Validate.js'


const router = express.Router()

router.post('/createTicket',validate,studentGuard,ticketController.createTicket)  // Used in CreateTicket.jsx
router.put('/assign/:ticketId',validate,mentorGuard,ticketController.assignTicket)  // Used in ViewTicket.jsx
router.put('/close/:ticketId',validate,mentorGuard,ticketController.closeTicket)  // Used in ChatBox.jsx
router.get('/count',validate,mentorGuard,ticketController.getTicketsCount)  // Used in AllTickets.jsx
router.get('/mentorTicketsCount',validate,mentorGuard,ticketController.getTicketCountForMentor)  // Used in MyTickets.jsx
router.get('/studentTicketsCount',validate,studentGuard,ticketController.getTicketCountForStudent)  // Used in MyQueries.jsx
router.get('/mentorTickets',validate,mentorGuard,ticketController.getTicketsByStatusForMentor)  // Used in MyTickets.jsx
router.get('/studentTickets',validate,studentGuard,ticketController.getTicketsByStatusForStudent)  // Used in MyQueries.jsx
router.get('/getAllTickets',validate,mentorGuard,ticketController.getAlltickets)  // Used in AllTickets.jsx
router.post('/findStudentTickets',validate,mentorGuard,ticketController.studentTicketsByStatus)  // Used in StudentTickets.jsx
router.post('/findStudentTicketsCount',validate,mentorGuard,ticketController.studentTicketsCount)  // Used in StudentTickets.jsx
router.get('/getTicketByTN/:tn',validate,mentorGuard,ticketController.getTicketByTN)  // Used in FindTicket.jsx
router.get('/',validate,mentorGuard,ticketController.getAllTicketsByStatus)  // Backend use
router.get('/:ticketId',validate,ticketController.getTicketById)  // Used in ViewTicket.jsx



export default router