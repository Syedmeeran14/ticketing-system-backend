import Auth from '../utils/auth.js'
import studentModel from '../models/students.js'
import mentorModel from '../models/mentors.js'


const validate = async (req, res, next) => {
    try {

        const token = req?.headers?.authorization?.split(" ")[1]

        if(!token) {
            return res.status(402).send({ message: "Token Not Found" })
        }

        const payload = await Auth.decodeToken(token);
        const model = payload.role === 'mentor' ? mentorModel : studentModel
        const userData = await model.findById(payload.id, { password: 0 })

        if(!userData) {
            return res.status(402).send({ message: "Access Denied" })
        }

        const currentTime = Math.floor(Date.now() / 1000)
        if(currentTime >= payload.exp) {
            return res.status(402).send({ message: "Token Expired" })
        }

        if(userData.role !== payload.role) {
            return res.status(402).send({ message: "Permission Denied" })
        }

        req.userData = userData
        next()

    } catch (error) {
        res.status(500).send({ message: error.message || "Internal Server Error" })
    }
}

export default validate