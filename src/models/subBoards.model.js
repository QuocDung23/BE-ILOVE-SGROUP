import mongoose from 'mongoose';

const subBoardSchema = new mongoose.Schema({
    name: {type: String, required: true},
    taskId: {type: mongoose.Schema.Types.ObjectId, ref: 'task', required: true},
    background: [{type: String}]
})

const SubBoardModel = mongoose.model('subBoard', subBoardSchema)

export default SubBoardModel