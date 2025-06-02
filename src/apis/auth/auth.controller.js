import AuthService from "./auth.service.js";
import mongoose from 'mongoose';

class AuthController {
  async register(req, res) {
    try {
      const { name, password, email, role } = req.body;
      if (!name || !password || !email) {
        return res
          .status(400)
          .json({ message: "Thiếu tên, mail hoặc mật khẩu" });
      }

      const user = await AuthService.register(name, password, email, role);
      return res.status(201).json({
        success: true,
        message: "Đăng kí thành công",
        data: {
          name: user.username,
          email: user.email,
          role: user.role,
          creator: user._id
        }
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
        data: {
          token,
          creator: user._id
        }
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
  
  async getAllUsers(req, res) {
    try {
      await AuthService.restrictTo('admin','member')(req.user);
      const users = await AuthService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(401).json({
        message: error.message,
      });
    }
  }

  async getUserDetail(req, res) {
    try {
      const { username } = req.params;
      await AuthService.restrictTo('admin', 'member')(req.user)
      const userDetail = await AuthService.getUserDetail(username)
      res.status(200).json({
        ...userDetail,
        creator: userDetail._id
      })
    } catch(error) {
      res.status(400).json({
        message: error.message
      })
    }
  }

  async updateUser(req, res) {
    try {
      const { username } = req.params
      const updateData = req.body
      const currentUser = req.user;

      const isAdmin = currentUser.role === 'admin';
      const isSelf = currentUser.name === username;

      if (!isAdmin && !isSelf) {
        return res.status(403).json({
          message: 'Bạn không có quyền cập nhật thông tin người dùng này!',
        });
      }

      const updateUser = await AuthService.updateUser(username, updateData)
      res.status(200).json({
        message: 'Cập nhật thành công',
        data: {
          ...updateUser,
          creator: updateUser._id
        }
      })
    } catch(error) {
      res.status(400).json({
        message: error.message
      })
    }
  }
}

export default new AuthController();
