import Auth from '../utils/auth.js'

const mentorGuard = async(req,res,next) => {
    try {

        let token = req?.headers?.authorization?.split(" ")[1]

        if(!token) {
            return res.status(402).send({
                message: "Token Not Found"
            })
        }

        let payload = await Auth.decodeToken(token)

        if(payload.role !== 'mentor') {
            return res.status(402).send({
                message: "Permission Denied"
            })
        }
        
        next()

    } catch(error) {
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export default mentorGuard