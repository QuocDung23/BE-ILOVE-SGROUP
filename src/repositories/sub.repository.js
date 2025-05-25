import TaskModel from '../models/task.model.js';
import SubModel from '../models/subBoards.model.js';


export class SubRepository {
    async getSubId(id) {
        try {
            const getSub = await SubModel.findById(id)
            return {
                _id: getSub._id,
                name: getSub.name
            }
        }catch(error) {
            throw new Error(`Lỗi lấy danh sách bằng Id: ${error.message}`);
        }
    }

    async updateSub(id, update) {
        try {
            const updateSub = await SubModel.findByIdAndUpdate(
                {_id: id},
                update,
                {new: true}
            )
            return updateSub
        } catch(error) {
            throw new Error(`Error Update Subboard: ${error.message}`);
        }
    }

    async deleteSub(id) {
        try{
            const deleteSub = await SubModel.findByIdAndDelete({_id: id}).lean()
            if(!deleteSub){
                throw new Error('Không có subboard này ')
            }
        } catch(error) {{
            throw new Error(`Error Delete Sub: ${error.message}`);
        }}
    }
}