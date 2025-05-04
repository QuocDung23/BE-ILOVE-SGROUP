import { UserRepository } from '../../repositories/users.repository.js'
import bcrypt from 'bcryptjs';
import { signJwt } from '../../service/jwt.sign.js'
import { createResetPassToken } from "../../service/resetToken.js";
import { mailService } from '../../service/mail.service.js';
import crypto from "crypto";



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
}


export default new AuthService();