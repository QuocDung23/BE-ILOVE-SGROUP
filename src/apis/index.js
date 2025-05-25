import express from 'express';
import authRoute  from './auth/auth.router.js';
import taskRoute from './taskManager/task.router.js'
import subRoute from './SubBoard/sub.router.js'

const router = express.Router();

router.use('/auth' ,authRoute);
router.use('/task', taskRoute)
router.use('/sub', subRoute)

export default router;