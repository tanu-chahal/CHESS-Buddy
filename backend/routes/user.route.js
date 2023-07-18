import express from 'express'
import {Update} from '../controllers/user.controller.js'
import {verifyToken} from '../middleware/verifyToken.js'

const router = express.Router()

router.put('/:id',verifyToken, Update)

export default router