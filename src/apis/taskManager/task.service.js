import { TaskRepository } from '../../repositories/task.repository.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';



const taskRepo = new TaskRepository();

class TaskService {
    constructor() {
        dotenv.config();
      }

    async createTask (dto) {
        const createTask = await taskRepo.createTask(dto)
        return createTask
    }

    async getAllTask() {

    }

    restrictTo(...roles) {
        return async (user) => {
          if (!roles.includes(user.role)) {
            throw new Error('Bạn không có quyền thực hiện hành động này');
          }
          return true;
        };
      }
}

export default new TaskService();