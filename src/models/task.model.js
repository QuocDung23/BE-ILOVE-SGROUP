import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;


const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required:true},
    dueTime: {type: Date, required: true},
    documentLink: { type: String},
    githubRepo: { type: String},
    creator: {type: ObjectId, ref: 'User', required: true},
    subBoards: [{ type: ObjectId, ref: 'subBoard'}],
    comments: [{ type: ObjectId, ref: 'Comment'}],
    team: {type: ObjectId, ref: 'Team'}
},
    { timestamps: true }
)

const TaskModel = mongoose.model('task', taskSchema);

export default TaskModel;