import { get } from 'mongoose';
import TaskService from './task.service.js'

class TaskController {
    async createTask(req, res) {
        try {
            console.log('check req.user:', req.user);
    
            if (!req.user || !req.user._id) {
                throw new Error('Không tìm thấy thông tin user từ token');
            }
    
            await TaskService.restrictTo('admin')(req.user);
            const { title, description, documentLink, githubRepo, team, dueTime, createdAt} = req.body;
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
                team,
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
            const { title, description, documentLink, githubRepo, team, dueTime, createdAt} = req.body;
            const getTask = await TaskService.getAllTask({ title, description, documentLink, githubRepo, team, dueTime, createdAt})
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

    async deleteTask(req, res) {
        try {
            const { id } = req.params
            const user = req.user


            const task = await TaskService.deleteTask(id, user)
            return res.status(200).json({
                success: true,
                message: 'Xóa thành công!',
                data: task
            })
        } catch(error) {    
            console.error(error);
            return res.status(400).json({
                success: false,
                message: `${error.message}`
            })
        }
    }

    async createSub(req, res) {
        try {
            const { taskId } = req.params
            const { name } = req.body

            if(req.user.role !== 'admin') {
                return res.status(400).json({message: 'Bạn không có quyền này!'})
            }

            const subBoard = await TaskService.createSub(taskId, name)
            return res.status(200).json({
                success: true,
                message: 'Tạo thành công.',
                data: subBoard
            })
        } catch(error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async createComment(req, res) {
        try {   
            const {content}  = req.body
            const {taskId}  = req.params
            const userId  = req.user._id
            console.log('req.user:', req.user._id);
            console.log('id of taks', taskId);
            console.log('content:', content);
            
            const createComment = await TaskService.createComment(content, taskId, userId)
            console.log("check create", createComment);
            
            return res.status(200).json({
                success: true,
                message: 'Comment thành công',
                data: createComment
            })
        } catch(error){
            return res.status(400).json({ message: error.message });
        }
    }

    async getComment(req, res) {
        try {
            const { taskId } = req.params
            console.log('id:', taskId);
            
            const getComment = await TaskService.getComment(taskId)
            return res.status(200).json({
                data: getComment
            })
        } catch(error) {
            return res.status(400).json({message: error.message})
        }
    }
}
    
export default new TaskController();
