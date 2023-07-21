import express from 'express'
import {getMatch, getMatches, createMatch} from '../controllers/match.controller.js'
import {verifyToken} from '../middleware/verifyToken.js'

const router = express.Router()

router.get('/:id',verifyToken, getMatch)
router.get('/',verifyToken, getMatches)
router.post('/',verifyToken, createMatch)

export default router