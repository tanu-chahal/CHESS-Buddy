import express from 'express'
import {getUser, Update} from '../controllers/user.controller.js'
import {verifyToken} from '../middleware/verifyToken.js'

const router = express.Router()

router.patch('/',verifyToken, Update)
router.get('/:id',getUser)

export default router