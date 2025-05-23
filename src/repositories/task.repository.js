import TaskModel from '../models/task.model.js';
import UserModel from '../models/users.model.js';
import mongoose from 'mongoose';

export class TaskRepository  {
    async createTask(dto) {
        try {
            const { title, description, documentLink, githubRepo, creator: creatorId, dueTime } = dto;

        const userExists = await UserModel.findById(creatorId).lean();
        if (!userExists) {
            throw new Error('Người dùng không tồn tại');
        }

        // Tạo task
        const result = await TaskModel.create({
            title,
            description,
            dueTime: new Date(dueTime),
            documentLink,
            githubRepo,
            creator: creatorId, // Lưu reference tới UserModel
        });

        // Lấy task với thông tin creator đã populate
        const task = await TaskModel.findById(result._id).populate('creator', '_id name').lean();

        return {
            _id: task._id,
            title: task.title,
            dueTime: task.dueTime,
            description: task.description,
            documentLink: task.documentLink,
            githubRepo: task.githubRepo,
            creator: {
                _id: task.creator._id,
                username: task.creator.name || 'unknown',
            },
            createdAt: task.createdAt
        };
        }catch(error) {
            console.error('Không thể tạo task', error);
            throw new Error('Không thể tạo được task')
        }
    }

    async findTaskByTitle(title) {
        if (!title) {
            throw new Error('Vui lòng cung cấp title!');
        }
        const task = await TaskModel.findOne({
            title: title
        })

        if(!title){
            throw new Error('Không tìm thấy title này !')
        }
        return {
            title: String(task.title),
            description: String(task.description),
            documentLink: String(task.documentLink),
            githubRepo: String(task.githubRepo)
        }
    }

    async getAllTask(){
        try{
            const task = await TaskModel.find().populate('creator', '_id name').lean();

            return task.map(task => ({
                _id: task._id,
                title: task.title,
                description: task.description,
                dueTime: task.dueTime,
                documentLink: task.documentLink,
                githubRepo: task.githubRepo,
                creator: {
                    _id: task.creator._id,
                    username: task.creator.name
                }
            }))
        } catch(error) {
            throw new Error(`Lỗi lấy danh sách: ${error.message}`)
        }
    }

    async getTaskById(id) {
        try{
            const task = await TaskModel.findOne({
                _id: id
            }).populate('creator', '_id name')
            if(!task) {
                throw new Error('Không có task này')
            }
            return {
                _id: task._id,
                title: task.title,
                dueTime: task.dueTime,
                description: task.description,
                documentLink: task.documentLink,
                githubRepo: task.githubRepo,
                creator: {
                    _id: task.creator._id,
                    username: task.creator.name || 'unknown',
                },
                createdAt: task.createdAt   
            }
        } catch(error) {
            throw new Error(`Lỗi lấy danh sách bằng Id: ${error.message}`)
        }
    }

    async UpdateTask(id, update) {
        try {
            const updateTask = await TaskModel.findOneAndUpdate(
                {_id: id},
                update,
                {new: true}
            )
            return updateTask
        } catch(error) {
            throw new Error(`Error Update Task: ${error.message}`)
        }
    }
}
