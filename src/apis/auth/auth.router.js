import express from 'express';
import AuthController from './auth.controller.js';

const authRoute = express.Router();

authRoute.post('/login', AuthController.login);
authRoute.post('/register', AuthController.register)
authRoute.post('/forgotPass', AuthController.forgotPass)
authRoute.patch('/resetPass/:token', AuthController.resetPass)
authRoute.post("/uploadImage", AuthController.uploadProfileImages);
export default authRoute;