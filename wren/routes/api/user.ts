import express from "express";
const router = express.Router();
import * as controller from '../../app/controllers/user_controller'
import { verifyToken } from '../../app/middleware/verify'



export default router