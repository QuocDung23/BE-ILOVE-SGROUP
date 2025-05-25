import express from 'express';
import authenticateToken from '../../middlewares/authenticateToken.js';
import TaskController from './task.controller.js'

const taskRoute = express.Router();

taskRoute.post('/create', authenticateToken, TaskController.createTask)
taskRoute.get('/getAll', TaskController.getAllTask)
taskRoute.get('/getTask/:id', TaskController.getTaskId)
taskRoute.patch('/updateTask/:id', authenticateToken, TaskController.updateTask)
taskRoute.delete('/deleteTask/:id', authenticateToken, TaskController.deleteTask)
taskRoute.post('/:taskId/subbroad', authenticateToken, TaskController.createSub)
export default taskRoute;