import { TeamRepository } from '../../repositories/team.repository.js'

const teamRepo = new TeamRepository();

class TeamService {
    async createTeam(dto) {
        const createTeam = await teamRepo.createTeam(dto)
        return createTeam
    }

    async getInfoTeam() {
      const getInfo = await teamRepo.getInfoTeam()
      return getInfo
    }

    async addMember(teamId, members) {
      const addMember = await teamRepo.addMember(teamId, members)

      return addMember
    }
    restrictTo(...roles) {
        return async (user) => {
          if (!roles.includes(user.role)) {
            throw new Error('Bạn không có quyền thực hiện hành động này');
          }
          return true;
        };
      }
}

export default new TeamService();