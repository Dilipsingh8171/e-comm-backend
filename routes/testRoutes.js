import express from 'express'
import { testController } from '../controllers/testController.js';

//router object
const router = express.Router()



//test route
router.get("/test",testController );

export default router
