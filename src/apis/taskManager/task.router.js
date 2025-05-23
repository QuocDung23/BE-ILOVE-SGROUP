import express from 'express';
import authenticateToken from '../../middlewares/authenticateToken.js';
import TaskController from './task.controller.js'

const taskRoute = express.Router();

taskRoute.post('/create', authenticateToken, TaskController.createTask)
taskRoute.get('/getAll', TaskController.getAllTask)
taskRoute.get('/getTask/:id', TaskController.getTaskId)
taskRoute.patch('/updateTask/:id', authenticateToken, TaskController.updateTask)
export default taskRoute;