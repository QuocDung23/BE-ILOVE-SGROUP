import { UserRepository } from '../../repositories/users.repository.js'
import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

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

    async example(username, password) {
        try {
          const newUser = await userRepo.create({
            name: username,
            password: password
          });
          
          console.log('Created user:', newUser);
          
          const allUsers = await userRepo.getAll();
          console.log('All users:', allUsers);
        } catch (error) {
          console.error('Error:', error.message);
        }
      }
}


export default new AuthService();