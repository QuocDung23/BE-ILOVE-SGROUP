import TaskModel from "../models/task.model.js";
import UserModel from "../models/users.model.js";
import SubModel from "../models/subBoards.model.js";
import CommentModel from "../models/comment.model.js";
import TeamModel from "../models/team.model.js";
import mongoose, { get } from "mongoose";

export class TaskRepository {
  async createTask(dto) {
    try {
      const {
        title,
        description,
        documentLink,
        githubRepo,
        creator: creatorId,
        team: teamId,
        dueTime,
      } = dto;

      const checkUser = await UserModel.findById(creatorId).lean();
      if (!checkUser) {
        throw new Error("Người dùng không tồn tại");
      }

      const checkTeam = await TeamModel.findById(teamId).lean();
      if (!checkTeam) {
        throw new Error(`Team không tồn tại với ID: ${teamId}`);
      }

      // Tạo task
      const result = await TaskModel.create({
        title,
        description,
        dueTime: new Date(dueTime),
        documentLink,
        githubRepo,
        creator: creatorId,
        team: teamId,
      });

      // Lấy task với thông tin creator đã populate
      const task = await TaskModel.findById(result._id)
        .populate("creator", "_id name")
        .populate("team", "_id nameTeam")
        .lean();

      return {
        _id: task._id,
        title: task.title,
        dueTime: task.dueTime,
        description: task.description,
        documentLink: task.documentLink,
        githubRepo: task.githubRepo,
        creator: {
          _id: task.creator._id,
          username: task.creator.name || "unknown",
        },
        team: {
          _id: task.team._id,
          nameTeam: task.team.nameTeam,
        },
        createdAt: task.createdAt,
      };
    } catch (error) {
      console.error("Không thể tạo task", error.message);
      throw new Error("Không thể tạo được task");
    }
  }

  async findTaskByTitle(title) {
    if (!title) {
      throw new Error("Vui lòng cung cấp title!");
    }
    const task = await TaskModel.findOne({
      title: title,
    });

    if (!title) {
      throw new Error("Không tìm thấy title này !");
    }
    return {
      title: String(task.title),
      description: String(task.description),
      documentLink: String(task.documentLink),
      githubRepo: String(task.githubRepo),
    };
  }

  async getAllTask() {
    try {
      const task = await TaskModel.find()
        .populate("creator", "_id name")
        .populate("subBoards")
        .populate({
          path: "comments",
          populate: {
            path: "userId",
            select: "_id name",
          },
        })
        .populate("team", "_id nameTeam")
        .lean();

      return task.map((task) => ({
        _id: task._id,
        title: task.title,
        description: task.description,
        dueTime: task.dueTime,
        documentLink: task.documentLink,
        githubRepo: task.githubRepo,
        subBoards: task.subBoards,
        comments: task.comments,
        creator: {
          _id: task.creator._id,
          username: task.creator.name,
        },
        team: task.team,
      }));
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách: ${error.message}`);
    }
  }

  async getTaskById(id) {
    try {
      const task = await TaskModel.findById(id)
        .populate("creator", "_id name")
        .populate("subBoards")
        .populate({
          path: "comments",
          populate: {
            path: "userId",
            select: "_id name",
          },
        })
        .populate("team", "_id nameTeam")
        .lean();

      if (!task) {
        throw new Error("Không có task này");
      }
      return {
        _id: task._id,
        title: task.title,
        dueTime: task.dueTime,
        description: task.description,
        documentLink: task.documentLink,
        githubRepo: task.githubRepo,
        subBoards: task.subBoards,
        comments: task.comments,
        creator: {
          _id: task.creator._id,
          username: task.creator.name || "unknown",
        },
        team: task.team,
        createdAt: task.createdAt,
      };
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách bằng Id: ${error.message}`);
    }
  }

  async UpdateTask(id, update) {
    try {
      const updateTask = await TaskModel.findOneAndUpdate({ _id: id }, update, {
        new: true,
      });
      return updateTask;
    } catch (error) {
      throw new Error(`Error Update Task: ${error.message}`);
    }
  }

  async deleteTask(id, deleteTask) {
    try {
      const deletaTask = await TaskModel.findOneAndDelete({ _id: id }).lean();
      if (!deletaTask) {
        throw new Error("Không có task này");
      }
      return deletaTask;
    } catch (error) {
      throw new Error(`Error Delete Task: ${error.message}`);
    }
  }

  async createSub(taskId, name) {
    const task = await TaskModel.findById(taskId);
    if (!task) {
      throw new Error("Task không tồn tại");
    }

    const createdSub = await SubModel.create({ name: name, taskId });

    task.subBoards.push(createdSub._id);
    await task.save();

    return {
      _id: createdSub._id,
      name: createdSub.name,
      taskId: createdSub.taskId,
    };
  }

  async createComment(content, taskId, userId) {
    try {
      const task = await TaskModel.findById(taskId);
      if (!task) {
        throw new Error("Task không tồn tại");
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("Người tạo không tồn tại");
      }

      const createComment = await CommentModel.create({
        content,
        userId,
        taskId,
      });
      task.comments.push(createComment._id);
      await task.save();
      return {
        _id: createComment._id,
        userId: {
          _id: user._id,
          name: user.name,
        },
        content: createComment.content,
      };
    } catch (error) {
      throw new Error(`Không thể tạo comment: ${error.message}`);
    }
  }

  async getComment(taskId) {
    try {
      const getComment = await CommentModel.find({ taskId }).populate(
        "userId",
        "name _id"
      );
      return getComment;
    } catch (error) {
      throw new Error(`Lỗi Lấy Comment ${error.message}`);
    }
  }
}
