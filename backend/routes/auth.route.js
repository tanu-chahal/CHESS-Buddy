import express from 'express'
import {Login, Register, Logout} from "../controllers/auth.controller.js"

const router = express.Router();

router.post("/login", Login);
router.post("/register", Register);
router.post("/logout", Logout);

export default router;