import { Router } from "express";
const router = Router();

// controllers
import { SignUp } from "../controllers/Auth.js";


//sendVerification Link
router.post('/send-verification-link', SignUp);


export default router;