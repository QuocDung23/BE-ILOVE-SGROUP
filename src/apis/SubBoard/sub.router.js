import express from 'express';
import authenticateToken from '../../middlewares/authenticateToken.js';
import SubController from './sub.controller.js'

const subRoute = express.Router()

subRoute.get('/getSub/:id', SubController.getSubId)
subRoute.patch('/update/:id', authenticateToken, SubController.updateSub)
subRoute.delete('/delete/:id', authenticateToken, SubController.deleteSub)
subRoute.post('/:id/upload-bg', SubController.uploadImages)
export default subRoute