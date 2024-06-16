import mentorModel from '../models/mentors.js'
import studentModel from '../models/students.js'
import Auth from '../utils/auth.js'

// Used in Login.jsx
const login = async (req, res) => {
    try {

        const { email, password } = req.body

        if(!email || !password) {
            return res.status(400).send({ message: 'Please enter the email and password' })
        }

        const [mentor, student] = await Promise.all([
            mentorModel.findOne({ email }),
            studentModel.findOne({ email })
        ])

        const user = mentor || student

        if (!user) {
            return res.status(400).send({ message: 'User Not Found' })
        }

        const isPasswordValid = await Auth.hashCompare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).send({ message: 'Incorrect Password' })
        }

        const token = await Auth.createToken({
            name: user.name,
            email: user.email,
            id: user._id,
            role: user.role
        })

        res.status(200).send({
            message: 'Login Successful',
            name: user.name,
            role: user.role,
            id: user._id,
            token
        })

    } catch (error) {
        res.status(500).send({ message: error.message || 'Internal Server Error' })
    }
}


// Backend use
const signUpMentor = async (req, res) => {
    try {

        const { email, password, name } = req.body

        if(!email || !password || !name) {
            return res.status(400).send({ message: 'Please enter the name, email, and password' });
        }

        const mentor = await mentorModel.findOne({ email })

        if(mentor) {
            return res.status(400).send({ message: 'User with this Email Id already exists' });
        }

        req.body.password = await Auth.hashPassword(password)
        await mentorModel.create(req.body)

        res.status(201).send({ message: 'SignUp successful' })

    } catch(error) {
        res.status(500).send({ message: error.message || 'Internal Server Error' });
    }
}


// Backend use
const signUpStudent = async(req,res) => {
    try {

        const { email, password, name } = req.body

        if( !email || !password || !name ) {
            return res.status(400).send({
                message: 'Please enter the name, email and password'
            })
        }

        const student = await studentModel.findOne({ email })

        if(student) {
            return res.status(400).send({
                message: "User with this Email Id already exists"
            })
        }

        req.body.password = await Auth.hashPassword(password)

        await studentModel.create(req.body)

        res.status(201).send({
            message: "SignUp successfull"
        })

    } catch(error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}


// Used in UseVerifyRole.jsx
const verify = async(req,res) => {
    try {
        
        const { role } = req.params
        const { userData } = req

        if(role !== userData.role) {
            return res.status(402).send({
                message: 'Verification failed'
            })
        }

        res.status(200).send({
            message: 'Verification Successfull'
        })
        
    } catch(error) {
        res.status(500).send({
            message: error.message || "Internal Server Error"
        })
    }
}


// Used in Profile.jsx
const profile = async (req, res) => {
    try {

        const { userData } = req

        const filter = { createdAt: 0, password: 0 }
        if(userData.role === 'student') {
            filter._id = 0
        }

        const model = userData.role === 'mentor' ? mentorModel : studentModel
        const data = await model.findById(userData._id, filter)
        
        return res.status(200).send(data)

    } catch (error) {
        res.status(500).send({
            message: error.message || 'Internal Server Error'
        })
    }
}


export default {
    login,
    signUpMentor,
    signUpStudent,
    verify,
    profile
}