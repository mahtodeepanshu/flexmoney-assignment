import express from 'express'
const router = express.Router()
import { protect } from '../middleware/authMiddleware.js'
import { authUser, getUser, logoutUser, registerUser, updateUser } from '../controllers/userController.js';

//Create Account
router.post('/', registerUser)

//Log In
router.post('/auth', authUser);

//Log Out
router.post('/logout', logoutUser);

//See and Update Info
router.route('/profile')
    .get(protect, getUser)
    .put(protect, updateUser);

export default router