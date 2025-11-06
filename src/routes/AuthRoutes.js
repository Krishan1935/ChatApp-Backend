import { Router } from "express";
const router = Router();

// controllers
import { SignUp, verifyEmail } from "../controllers/Auth.js";


//sendVerification Link
router.post('/send-verification-link', SignUp);

// verify email
router.post('/verify-email/:jwtToken', verifyEmail);


export default router;