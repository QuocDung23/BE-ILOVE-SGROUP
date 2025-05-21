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
}

export default new TaskController();
