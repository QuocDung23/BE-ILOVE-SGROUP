import { TaskRepository } from '../../repositories/task.repository.js';
import dotenv from 'dotenv';
import mongoose, { get } from 'mongoose';



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
      const getTask = await taskRepo.getAllTask()
      return getTask
    }

    async getTaskId(id) {
      const getTaskId = await taskRepo.getTaskById({_id: id})
      return getTaskId
    }

    async updateTask(id , update) {
      const taskId = await taskRepo.getTaskById(id)
      if(!taskId) {
        throw new Error('Không tồn tại Task này')
      }

      const validRole = 'admin'
      if(update.role && !validRole.includes(update.role)) {
        throw new Error('Bạn không có quyền thay đổi Task')
      }

      const taskInfo = {
        title: update.title || taskId.title,
        description: update.description || taskId.description,
        dueTime: update.dueTime || taskId.dueTime,
        documentLink: update.documentLink || taskId.documentLink,
        githubRepo: update.githubRepo || taskId.githubRepo
      }

      const updateData = await taskRepo.UpdateTask(id, {$set: taskInfo})
      if(!updateData){
        throw new Error('Cập nhật thất bại')
      }
      return {
        title: updateData.title,
        description: updateData.description,
        dueTime: updateData.dueTime,
        documentLink: updateData.documentLink,
        githubRepo: updateData.githubRepo
      }
    }

    async deleteTask(id, user) {
      if(user.role !== 'admin'){
        throw new Error('Bạn không có quyền xóa task')
      }

      const deleteTask = await taskRepo.deleteTask(id)
      if(!deleteTask){
        throw new Error('Xóa không thành công')
      }
      return deleteTask
    }

    async createSub(taskId, name) {
      if(!name) {
        throw new Error('Vui lòng điền thông tin')
      }
      return await taskRepo.createSub(taskId, name)
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