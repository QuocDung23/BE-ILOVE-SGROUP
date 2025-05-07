import { UserRepository } from "../../repositories/users.repository.js";
import AuthService from "./auth.service.js";
import { createResetPassToken } from "../../service/resetToken.js";
import { mailService } from "../../service/mail.service.js";
import crypto from "crypto";
import bcrypt from 'bcryptjs';


const userRepo = new UserRepository();

class AuthController {
  async register(req, res) {
    try {
      const { name, password, email } = req.body;
      if (!name || !password || !email) {
        return res
          .status(400)
          .json({ message: "Thiếu tên, mail hoặc mật khẩu" });
      }

      const user = await AuthService.register(name, password, email);
      return res.status(201).json({
        success: true,
        message: "Đăng kí thành công",
        data: user,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  //
  async login(req, res) {
    try {
      const { name, password } = req.body;
      console.log(name, password);

      if (!name || !password) {
        return res.status(400).json({
          success: false,
          message: "Thiếu tên hoặc mật khẩu",
        });
      }

      const { user, token } = await AuthService.login(name, password);
      console.log(user, token);
      if (!user || !token) {
        return res.status(401).json({
          success: false,
          message: "Tên đăng nhập hoặc mật khẩu không đúng",
        });
      }

      req.user = user; // Gán user cho req nếu cần dùng ở middleware tiếp theo

      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ: " + error.message,
      });
    }
  }

  async forgotPass(req, res) {
    try {
      const { email, name } = req.body;
      const result = await AuthService.forgotPass(email, name);
      return res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ:" + error.message,
      });
    }
  }

  async resetPass(req, res) {
   try {
    const {newPassword} = req.body;
    const {token} = req.params;
    const result = await AuthService.resetPass(newPassword, token)
      return res.status(200).json({
        success: true,
        message: result.message
      })
   } catch (error){
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'lỗi máy chủ' + error.message
    })
   }
  }
  async uploadProfileImages(req, res) {
    try {
      const { name, folderPath } = req.body;

      if (!name || !folderPath) {
        return res.status(400).json({
          success: false,
          message: "Thiếu username hoặc folderPath",
        });
      }

      const result = await AuthService.uploadImages(name, folderPath);

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

export default new AuthController();
