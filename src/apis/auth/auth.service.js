import { UserRepository } from '../../repositories/users.repository.js'
import bcrypt from 'bcryptjs';
import { signJwt } from '../../service/jwt.sign.js'
import { createResetPassToken } from "../../service/resetToken.js";
import { mailService } from '../../service/mail.service.js';
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";


const userRepo = new UserRepository();

class AuthService {
  async register(name, password, email) {
    const checkUser = await userRepo.findByUsername(name);
    console.log(checkUser);
    
    if (checkUser) {
      throw new Error('User đã tồn tại');
    }
    const salt = await bcrypt.genSalt(10)
    const hashPass = await bcrypt.hash(password, salt);
    console.log(name, hashPass, email);
    const createUser = await userRepo.create({
      name: name,
      password: hashPass,
      email: email
    });
    console.log(createUser);
    return {
      username: createUser.name
    };
  }

  async login(name, password) {
    const user = await userRepo.findByUsername( name );
    console.log(user); 

    if (!user) throw new Error("Không tìm thấy người dùng");

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) throw new Error("Mật khẩu không đúng");
    console.log('SECRET_KEY:', process.env.SECRET_KEY);
    const token = signJwt(user)
    return { user, token }; 
  }

  async forgotPass(email, name) {
    if (!email || !name) {
      throw new Error("Vui lòng nhập đủ thông tin")
    }
    const user = await userRepo.findByMail(email)
    if (!user) {
      throw new Error("Email không tồn tại")
    } if (user.name !== name) {
      throw new Error("Name không tồn tại")
    }

    const { createToken, hashToken, expireTime} = await createResetPassToken();
    user.resetPasswordToken = hashToken;
    user.resetPasswordExpires = expireTime;
    await user.save();

    await mailService.sendMail(
      user.email,
      'Yêu cầu đặt lại mật khẩu',
      `Xin chào ${user.name}`,
      {
        name: user.name,
        message: `Bạn đã yêu cầu đặt lại mật khẩu. Mã token là ${createToken}`,
      }
    );

    return {message: "Token đã được gửi qua email"}
  };

  async resetPass(newPassword, token) {
    if(!newPassword) {
      throw new Error("Vui lòng nhật mặt khẩu mới")
    }

    const hashToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await userRepo.getTokenResetPass({resetPasswordToken: hashToken, resetPasswordExpires: {$gt: Date.now()}});
      if(!user) {
        throw new Error("Token không hoạt động")
      }
    
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(newPassword, salt)

    user.password = hashPass;
    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;

    await user.save()

    return {message: "đổi mật khẩu thành công"}
  }

  constructor() {
    dotenv.config();
  }

  async uploadImages(username, inputPath) {
    try {
      // Cấu hình Cloudinary
      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
      });

      console.log("Cloudinary Config:", cloudinary.config());

      // Kiểm tra user tồn tại
      const userCheck = await userRepo.findByUsername(username);
      if (!userCheck) {
        throw new Error(`Không tìm thấy user: ${username}`);
      }

      const uploaded = [];

      // Kiểm tra inputPath là URL hay đường dẫn thư mục
      const isUrl = inputPath.startsWith('http://') || inputPath.startsWith('https://');

      if (isUrl) {
        // Xử lý upload từ URL
        console.log(`📤 Đang upload từ URL: ${inputPath} ...`);

        const uploadResult = await cloudinary.uploader.upload(inputPath, {
          folder: "uploaded_images",
          resource_type: "image",
        });

        console.log(`✅ Upload thành công từ URL`);
        console.log("🔗 URL:", uploadResult.secure_url);

        // Cập nhật URL vào DB
        const user = await userRepo.updateUserByUsername(username, {
          $push: { linkImages: uploadResult.secure_url },
        });

        if (user) {
          console.log(`✅ Lưu URL vào DB thành công cho user: ${username}`);
          uploaded.push(uploadResult.secure_url);
        } else {
          console.log(`⚠️ Lưu URL thất bại cho user: ${username}`);
        }
      } else {
        // Xử lý upload từ thư mục cục bộ
        if (!fs.existsSync(inputPath)) {
          throw new Error(`Thư mục ${inputPath} không tồn tại`);
        }

        const files = fs
          .readdirSync(inputPath)
          .filter(
            (file) =>
              file.endsWith(".jpg") ||
              file.endsWith(".png") ||
              file.endsWith(".jpeg")
          );

        console.log(`🔍 Tìm thấy ${files.length} ảnh trong thư mục.`);

        if (files.length === 0) {
          return {
            success: false,
            message: "Không tìm thấy ảnh nào trong thư mục",
            images: [],
          };
        }

        for (const file of files) {
          const filePath = path.join(inputPath, file);
          console.log(`📤 Đang upload: ${file} ...`);

          try {
            const uploadResult = await cloudinary.uploader.upload(filePath, {
              folder: "uploaded_images",
              resource_type: "image",
            });

            console.log(`✅ Upload thành công: ${file}`);
            console.log("🔗 URL:", uploadResult.secure_url);

            const user = await userRepo.updateUserByUsername(username, {
              $push: { linkImages: uploadResult.secure_url },
            });

            if (user) {
              console.log(`✅ Lưu URL vào DB thành công cho user: ${username}`);
              uploaded.push(uploadResult.secure_url);
            } else {
              console.log(`⚠️ Lưu URL thất bại cho user: ${username}`);
            }
          } catch (uploadError) {
            console.error(`❌ Lỗi khi upload ${file}:`, uploadError);
          }
        }
      }

      console.log("🎉 Hoàn tất upload tất cả ảnh!");

      return {
        success: uploaded.length > 0,
        message: uploaded.length > 0 
          ? `Đã upload ${uploaded.length} ảnh thành công` 
          : "Không có ảnh nào được upload thành công",
        images: uploaded,
      };
    } catch (error) {
      console.error("❌ Lỗi:", error.message);
      return {
        success: false,
        message: `Lỗi khi upload ảnh: ${error.message}`,
        images: [],
      };
    }
  }
}


export default new AuthService();