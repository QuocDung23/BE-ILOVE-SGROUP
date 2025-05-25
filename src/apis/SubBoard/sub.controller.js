import SubService from './sub.service.js'

class SubController {
    async getSubId (req, res) {
            try { 
                const { id } = req.params
                const getSub = await SubService.getSubId(id)
                return res.status(200).json({
                    data: getSub
                })
            } catch(error) {
                console.error('Error Get All Task:', error.message)
                return res.status(500).json({message: error.message})
            }
        }
    async updateSub(req, res) {
        try {
          const { id } = req.params
          const  update  = req.body

          if(req.user.role !== 'admin') {
            throw new Error('Bạn không có quyền thay đổi Sub!')
          }

          const updateSub = await SubService.updateSub(id , update)
          return res.status(200).json({
            success: true,
            message: 'Cập nhật thành công!',
            data: updateSub
        })
        } catch(error) {
            console.error(error);
            return res.status(400).json({
                success:false,
                message: error.message
            })
        }
    }

    async deleteSub(req, res) {
        try {
            const { id } = req.params
            const user = req.user

            const deleteSub = await SubService.deleteSub(id, user)
            return res.status(200).json({
                success: true,
                message: 'Xóa thành công'
            })
        } catch (error) {
            console.error('Error delete Sub', error);
            res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }
    async uploadImages(req, res) {
        try {
            const { id } = req.params
          const { folderPath } = req.body;
          if (!folderPath) {
            return res.status(400).json({
              success: false,
              message: "Thiếu folderPath",
            });
          }
    
          const result = await SubService.uploadImages(id, folderPath);
    
          return res.status(200).json({
            success: result.success,
            message: result.message,
            images: result.images,
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            success: false,
            message: 'Lỗi khi upload ảnh: ' + error.message,
          });
        }
      }
}

export default new SubController()