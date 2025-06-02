import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;


const subBoardSchema = new mongoose.Schema({
    name: {type: String, required: true},
    taskId: {type: ObjectId, ref: 'task', required: true},
    background: [{type: String}]
})

const SubBoardModel = mongoose.model('subBoard', subBoardSchema)

export default SubBoardModel