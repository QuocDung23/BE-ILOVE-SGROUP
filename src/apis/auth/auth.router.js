import express from 'express';
import AuthController from './auth.controller.js';

const authRoute = express.Router();

authRoute.post('/example', AuthController.example);
authRoute.post('/register', AuthController.register)
export default authRoute;