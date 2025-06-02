import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;


const CommentSchema = new mongoose.Schema({
    content: {type: String, required: true},
    userId: {type: ObjectId, ref: 'User', required: true},
    taskId: {type: ObjectId, ref: 'task', required: true},
}, { timestamps: true })

const CommentModel = mongoose.model('Comment', CommentSchema)

export default CommentModel
