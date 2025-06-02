import TeamModel from '../models/team.model.js'
import UserModel from '../models/users.model.js'


export class TeamRepository {
    async createTeam(dto) {
        try {
            const { nameTeam, creator, leader, members } = dto
            const checkCreator = await UserModel.findById(creator).lean()
            if(!checkCreator) {
                throw new Error('Người dùng không tồn tại!')
            }
            const leaderUser = await UserModel.findOne({name: leader}).lean()
                if(!leaderUser) {
                    throw new Error('Không có người này')
                }
            
            const memberUsers = await UserModel.find({name: {$in: members} }).lean()
            if (memberUsers.length !== members.length) {
                throw new Error('Một số thành viên không tồn tại!');
              }
            const memberIds = memberUsers.map(u => u._id);

            const createTeam = await TeamModel.create({
                nameTeam,
                creator,
                leader: leaderUser._id,
                members: memberIds
            })

            const result = await TeamModel.findById(createTeam._id)
                .populate('creator', '_id name')
                .populate('leader', '_id name')
                .populate('members', '_id name')
                .lean()

            return result
        }catch(error) {
            throw new Error(`Lỗi tạo Team: ${error.message}`)
        }
    }

    async getInfoTeam() {
        try{
            const getTeam = await TeamModel.find()
            .populate('creator', '_id name')
            .populate('leader', '_id name')
            .populate('members', '_id name')
            .lean()

            return getTeam.map(team => ({
                _id: team._id,
                nameTeam: team.nameTeam,
                creator: team.creator,
                leader: team.leader,
                members: team.members
            }))
        } catch(error) {
            throw new Error(`Lỗi tạo Team: ${error.message}`)
        }
    }

}