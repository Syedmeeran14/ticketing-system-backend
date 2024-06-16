import mongoose from "./index.js"


const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}


let studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Name is required']
    },
    email: {
        type: String,
        required: [true,'Email is required'],
        validate: {
            validator: (data) => validateEmail(data)
        }
    },
    password: {
        type: String,
        required: [true,'Password is required']
    },
    role: {
        type: String,
        default: 'student'
    },
    createdAt: {
        type: Date,
        default: () => new Date
    }
},{
    collection: 'student',
    versionKey: false
})



let studentModel = mongoose.model('student',studentSchema)



export default studentModel