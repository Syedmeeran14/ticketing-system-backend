import ticketModel from "../models/tickets.js"

// Backend use
const getAlltickets = async(req,res) => {
    try{
        
        const tickets = await ticketModel.find()

        if(!tickets.length) {
            return res.status(400).send({
                message: 'No tickets available'
            })  
        }

        res.status(200).send({
            message: 'Data Fetch Successfull',
            tickets
        })

    } catch(error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}


// Used in CreateQuery.jsx
const createTicket = async(req,res) => {
    try{

        const { title, description } = req.body

        if( !title || !description) {
            return res.status(400).send({
                message: 'Please provide the Title and Description'
            })
        }

        const ticket = new ticketModel(req.body)

        const tn = 'TN2024' + ( (await ticketModel.find()).length? (await ticketModel.find()).length + 1 : 1 )
        
        Object.assign(ticket, {
            tn,
            studentId : req.userData._id,
            studentName : req.userData.name,
            studentEmail : req.userData.email
        })

        await ticket.save()

        res.status(201).send({
            message: 'Ticket Created Successfully',
            ticket
        })

    } catch(error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}


// Used in ViewTicket.jsx
const getTicketById = async(req,res) => {
    try{

        const { ticketId } = req.params

        const ticket = await ticketModel.findById(ticketId)

        if(!ticket) {
            return res.status(400).send({
                message: 'Invalid Ticket Id'
            })   
        }

        res.status(200).send({
            message: 'Data fetch successfull',
            ticket
        })

    } catch(error) {
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error
        })
    }
}


// Used in FindTicket.jsx
const getTicketByTN = async(req,res) => {
    try{

        const { tn } = req.params

        const ticket = await ticketModel.findOne({ tn })

        if(!ticket) {
            return res.status(400).send({
                message: 'Invalid Ticket Number'
            })   
        }

        res.status(200).send({
            message: 'Data fetch successfull',
            ticket
        })

    } catch(error) {
        res.status(500).send({
            message: error.message || "Internal Server Error",
            error
        })
    }
}


// Used in ViewTicket.jsx
const assignTicket = async (req, res) => {
    try {

        const { userData, params: { ticketId } } = req
        const ticket = await ticketModel.findById(ticketId)

        if(!ticket) {
            return res.status(400).send({ message: 'Invalid Ticket Id' })
        }

        if(ticket.status !== 'Open') {
            return res.status(400).send({ message: 'Ticket has to be Open to get Assigned' })
        }

        Object.assign(ticket, {
            assignedTo: userData.name,
            assignedToId: userData._id,
            assignedAt: new Date(),
            status: 'Assigned'
        })

        await ticket.save()
        res.status(200).send({ message: 'Ticket Assigned Successfully' })

    } catch(error) {
        res.status(500).send({ message: error.message || 'Internal Server Error' })
    }
}


// Used in ChatBox.jsx
const closeTicket = async (req, res) => {
    try {

        const { userData, params: { ticketId }, body: { resolution } } = req
        const ticket = await ticketModel.findById(ticketId)

        if(!ticket) {
            return res.status(400).send({ message: 'Invalid Ticket Id' })
        }

        if(ticket.status !== 'Assigned') {
            return res.status(400).send({ message: 'Ticket has to be assigned to get closed' })
        }

        if(ticket.assignedToId.toString() !== userData._id.toString()) {
            return res.status(402).send({ message: 'You are not allowed to close this' });
        }

        if(!resolution) {
            return res.status(400).send({ message: 'Resolution is Required' });
        }

        Object.assign(ticket, {
            closedAt: new Date(),
            status: 'Closed',
            resolution
        })

        await ticket.save();
        res.status(200).send({ message: 'Ticket Closed Successfully' })

    } catch (error) {
        res.status(500).send({ message: error.message || 'Internal Server Error' })
    }
}


// Used in AllTickets.jsx
const getTicketsCount = async(req,res) => {
    try {

        const data = await ticketModel.aggregate([
            {$group:{_id:"$status",total:{$sum: 1}}}
        ])

        const countData = data.reduce((acc, e) => {
            acc[e._id] = e.total
            return acc
        },{})

        res.status(200).send(countData)
        
    } catch(error) {
        res.status(500).send({
            message: error.message || 'Internal Server Error'
        })
    }
}


// Used in MyTickets.jsx
const getTicketCountForMentor = async(req,res) => {
    try {

        const mentorId = req.userData._id

        const data = await ticketModel.aggregate([
            { $match: { assignedToId: mentorId } },
            { $group: { _id: "$status", total: { $sum: 1 } } }
        ])

        const countData = data.reduce((acc, e) => {
            acc[e._id] = e.total
            return acc
        },{})

        res.status(200).send(countData)
        
    } catch(error) {
        res.status(500).send({
            message: error.message || 'Internal Server Error'
        })
    }
}


// Used in MyQueries.jsx
const getTicketCountForStudent = async(req,res) => {
    try {

        const id = req.userData._id

        const data = await ticketModel.aggregate([
            { $match: { studentId: id } },
            { $group: { _id: "$status", total: { $sum: 1 } } }
        ])

        const countData = data.reduce((acc, e) => {
            acc[e._id] = e.total
            return acc
        },{})

        res.status(200).send(countData)
        
    } catch(error) {
        res.status(500).send({
            message: error.message || 'Internal Server Error'
        })
    }
}


// Used in AllTickets.jsx
const getAllTicketsByStatus = async(req,res) => {
    try {

        const { status } = req.query
        
        if(!status) {
            return res.status(400).send({
                message: 'Enter a Valid Request'
            })
        }
        
        const tickets = await ticketModel.find({status})
        res.status(200).send({
            message: 'Data Fetch Successfull',
            tickets
        })

    } catch(error) {
        res.status(500).send({
            message: error.message || 'Internal Server Error'
        })
    }
}


// Used in MyTickets.jsx
const getTicketsByStatusForMentor = async(req,res) => {
    try {

        const { status } = req.query

        if(!status) {
            return res.status(400).send({
                message: 'Enter a Valid Request'
            })
        }

        const tickets = await ticketModel.find({assignedToId: req.userData._id, status})

        res.status(200).send({
            message: 'Data Fetch Successfull',
            tickets
        })

    } catch(error) {
        res.status(500).send({
            message: error.message || 'Internal Server Error'
        })
    }
}


// Used in MyQueries.jsx
const getTicketsByStatusForStudent = async (req, res) => {
    try {

        const { status } = req.query

        if(!status) {
            return res.status(400).send({ message: 'Enter a Valid Request' })
        }

        const tickets = await ticketModel.find({ studentId: req.userData._id, status })

        res.status(200).send({
            message: 'Data Fetch Successful',
            tickets
        })

    } catch (error) {
        res.status(500).send({ message: error.message || 'Internal Server Error' })
    }
}


// Used in StudentTickets.jsx
const studentTicketsCount = async(req,res) => {
    try {

        const { email } = req.body

        const data = await ticketModel.aggregate([
            { $match: { studentEmail: email } },
            { $group: { _id: "$status", total: { $sum: 1 } } }
        ])

        const countData = data.reduce((acc, e) => {
            acc[e._id] = e.total
            return acc
        },{})

        res.status(200).send(countData)
        
    } catch(error) {
        res.status(500).send({
            message: error.message || 'Internal Server Error'
        })
    }
}


// Used in StudentTickets.jsx
const studentTicketsByStatus = async(req,res) => {
    try{
        
        const { status,email } = req.body

        if(!email || !status) {
            return res.status(400).send({
                message: 'Enter a Valid Request'
            })
        }

        const tickets = await ticketModel.find({studentEmail: email, status})

        res.status(200).send({
            message: 'Data Fetch Successfull',
            tickets
        })

    } catch(error) {
        res.status(400).send({
            message: error.message || 'Internal Server Error'
        })
    }
}



export default {
    createTicket,
    getTicketById,
    getTicketByTN,
    assignTicket,
    closeTicket,
    getTicketsCount,
    getTicketCountForMentor,
    getTicketCountForStudent,
    getAllTicketsByStatus,
    getTicketsByStatusForMentor,
    getTicketsByStatusForStudent,
    getAlltickets,
    studentTicketsByStatus,
    studentTicketsCount
}