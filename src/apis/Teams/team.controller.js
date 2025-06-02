import TeamService from './team.service.js'

class TeamController {
    async createTeam(req, res) {
        try{
            if(!req.user || !req.user._id){
                throw new Error('Không tìm thấy thông tin user từ token');
            }

            await TeamService.restrictTo('admin')(req.user)
            const {nameTeam, leader, members} = req.body;
            if(!nameTeam || !leader || !members) {
               return res.status(400).json({
                message: 'Vui lòng điền đủ thông tin'
               })
            }

            const dataTeam = {
                nameTeam,
                creator: {
                    _id: req.user._id,
                    name: req.user.name
                },
                leader,
                members
            }

            const createTeam = await TeamService.createTeam(dataTeam)
            return res.status(200).json({
                success: true,
                message: 'Tạo thành công',
                data: createTeam,
            });
        } catch(error) {
            console.error('Error in createTask:', error.message);
            if (error.message === 'Bạn không có quyền thực hiện hành động này') {
                return res.status(403).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    }

    async getInfoTeam(req, res){
        try{
            const {nameTeam, creator, leader, members} = req.body
            const getInfo = await TeamService.getInfoTeam({nameTeam, creator, leader, members})
            return res.status(200).json({
                data: getInfo
            })
        } catch(error) {
            console.error('Error Get All Task:', error.message)
            return res.status(500).json({message: error.message})
        }
    }

    async addMember(req, res){
        try{
            if(!req.user || !req.user._id){
                throw new Error('Không tìm thấy thông tin user từ token');
            }
            await TeamService.restrictTo('admin')(req.user)
            const { teamId } = req.params
            const { members } = req.body
            console.log('teamId:', teamId);
            console.log('member:', members);
            
            
            const addMember = await TeamService.addMember(teamId, members)
            return res.status(200).json({
                success: true,
                message: 'Tạo thành công',
                data: addMember,
            });
        } catch(error) {
            return res.status(403).json({ message: error.message });
        }
    }
}

export default new TeamController()