import express from 'express'
import userController from '../controllers/users.js'
import validate from '../middlewares/Validate.js'


const router = express.Router()

router.post('/login',userController.login)  // Used in Login.jsx
router.get('/verify/:role',validate,userController.verify)  // Used in UseVerifyRole.jsx
router.get('/profile',validate,userController.profile)  // Used in Profile.jsx
router.post('/signupMentor',userController.signUpMentor)  // Backend use
router.post('/signupStudent',userController.signUpStudent)  // Backend use



export default router