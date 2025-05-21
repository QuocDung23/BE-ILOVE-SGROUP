import express from 'express';
import authRoute  from './auth/auth.router.js';
import taskRoute from './taskManager/task.router.js'

const router = express.Router();

router.use('/auth' ,authRoute);
router.use('/task', taskRoute)

export default router;