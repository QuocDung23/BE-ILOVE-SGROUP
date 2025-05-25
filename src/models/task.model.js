import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required:true},
    dueTime: {type: Date, required: true},
    documentLink: { type: String},
    githubRepo: { type: String},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    subBoards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'subBoard'}],
    // comments: [{ type: ObjectId, ref: 'Comment'}],
},
    { timestamps: true }
)

const TaskModel = mongoose.model('task', taskSchema);

export default TaskModel;