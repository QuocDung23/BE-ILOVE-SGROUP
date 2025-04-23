import { UserRepository } from '../../repositories/users.repository.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const userRepo = new UserRepository();

class AuthService {
  async register(name, password, email) {
    const checkUser = await userRepo.findByUsername(name);
    console.log(checkUser);
    
    if (checkUser) {
      throw new Error('User đã tồn tại');
    }

    const hashPass = await bcrypt.hash(password, 15);
    console.log(name, hashPass, email);
    
    const createUser = await userRepo.create({
      name: name,
      password: hashPass,
      email: email // Đảm bảo bạn lưu email nếu cần
    });
    console.log(createUser);
    
    return {
      username: createUser.name
    };
  }

  async example(name, password) {
    const user = await userRepo.findByUsername( name );
    console.log(user);
    

    if (!user) throw new Error("Không tìm thấy người dùng");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Mật khẩu không đúng");
    console.log('SECRET_KEY:', process.env.SECRET_KEY);
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.SECRET_KEY, 
      { expiresIn: "1d" }
    );
    return { user, token }; 
  }
}


export default new AuthService();