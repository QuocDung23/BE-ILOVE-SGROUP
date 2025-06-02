import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const TeamSchema = new mongoose.Schema({
    nameTeam: {type: String, required: true},
    creator:{type: ObjectId, ref:'User'},
    leader:{type: ObjectId, ref: 'User'},
    members: [{type: ObjectId, ref:'User'}]
}, {timestamps: true})

const TeamModel = mongoose.model('Team', TeamSchema)

export default TeamModel