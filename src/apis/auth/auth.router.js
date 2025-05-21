import express from 'express';
import AuthController from './auth.controller.js';
import authenticateToken from '../../middlewares/authenticateToken.js';

const authRoute = express.Router();

authRoute.post('/login', AuthController.login);
authRoute.post('/register', AuthController.register)
authRoute.post('/forgotPass', AuthController.forgotPass)
authRoute.patch('/resetPass/:token', AuthController.resetPass)
authRoute.post("/uploadImage", AuthController.uploadProfileImages);
authRoute.get("/user",authenticateToken, AuthController.getAllUsers)
authRoute.get("/user/:username", authenticateToken, AuthController.getUserDetail)
authRoute.patch("/updateUser/:username", authenticateToken, AuthController.updateUser)
export default authRoute;