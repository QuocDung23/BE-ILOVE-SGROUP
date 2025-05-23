import { get } from 'mongoose';
import TaskService from './task.service.js'

class TaskController {
    async createTask(req, res) {
        try {
            console.log('req.user:', req.user);
    
            if (!req.user || !req.user._id) {
                throw new Error('Không tìm thấy thông tin user từ token');
            }
    
            await TaskService.restrictTo('admin')(req.user);
            const { title, description, documentLink, githubRepo, dueTime, createdAt} = req.body;
            if (!title || !description || !documentLink || !githubRepo) {
                return res.status(400).json({
                    message: 'Điền thiếu thông tin. Vui lòng nhập đủ thông tin!',
                });
            }
    
            const taskData = {
                title,
                description,
                dueTime,
                documentLink,
                githubRepo,
                creator: {
                    _id: req.user._id,
                    name: req.user.name
                },
                createdAt
            };
    
            const createdTask = await TaskService.createTask(taskData);
            return res.status(200).json({
                success: true,
                message: 'Tạo thành công',
                data: createdTask,
            });
        } catch (error) {
            console.error('Error in createTask:', error.message);
            if (error.message === 'Bạn không có quyền thực hiện hành động này') {
                return res.status(403).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    }

    async getAllTask(req, res) {
        try {
            const { title, description, documentLink, githubRepo, dueTime, createdAt} = req.body;
            const getTask = await TaskService.getAllTask({ title, description, documentLink, githubRepo, dueTime, createdAt})
            return res.status(200).json({
                data: getTask
            })
        } catch(error) {
            console.error('Error Get All Task:', error.message)
            return res.status(500).json({message: error.message})
        }
    }

    async getTaskId (req, res) {
        try { 
            const { id } = req.params
            const getTask = await TaskService.getTaskId(id)
            return res.status(200).json({
                data: getTask
            })
        } catch(error) {
            console.error('Error Get All Task:', error.message)
            return res.status(500).json({message: error.message})
        }
    }

    async updateTask(req, res) {
        try {
            const { id } = req.params
            const update = req.body

            if(req.user.role !== 'admin') {
                throw new Error('Bạn không có quyền thay đổi Task!')
            }

            const updateData = await TaskService.updateTask(id, update)
            return res.status(200).json({
                success: true,
                data: updateData
            })
        } catch(error) {
            console.error(error);
            return res.status(400).json({
                success:false,
                message: error.message
            })
        }
    }
}

export default new TaskController();
