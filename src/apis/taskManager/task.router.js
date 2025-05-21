import express from 'express';
import authenticateToken from '../../middlewares/authenticateToken.js';
import TaskController from './task.controller.js'

const taskRoute = express.Router();

taskRoute.post('/create', authenticateToken, TaskController.createTask)

export default taskRoute;