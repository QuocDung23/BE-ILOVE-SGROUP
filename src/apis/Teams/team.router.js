import express from 'express';
import authenticateToken from '../../middlewares/authenticateToken.js';
import TeamController from './team.controller.js'

const teamRoute = express.Router();

teamRoute.post('/create', authenticateToken, TeamController.createTeam)
teamRoute.get('/getInfoTeam', TeamController.getInfoTeam)
teamRoute.patch('/add/:teamId', authenticateToken, TeamController.addMember)

export default teamRoute;