import UserModel from '../models/users.model.js';

export class UserRepository {
  async create(dto) {
    const { name, email, password } = dto;

    if (!name || !email || !password) {
      console.log(name,  email, password);
      throw new Error('Name, email, and password are required.');
    }
    const result = await UserModel.create({
      name,
      email,
      password,
    });

    return {
      name,
      email,
      id: String(result._id),
    };
  }

  async getOneById(id) {
    const user = await UserModel.findOne({
      _id: id,
    });

    if (!user) {
      throw new Error('not found');
    }

    return {
      id: String(user._id),
      name: String(user.name),
      email: String(user.email),
    };
  }

  async findByUsername(username) {
    try {
      const user = await UserModel.findOne({name: username }); // Sử dụng findOne thay vì find
      return user; // Trả về người dùng tìm được
    } catch (err) {
      console.error('Error finding user by username:', err);
      throw new Error('Error finding user');
    }
  }
  async findByMail(email) {
    try {
      const user = await UserModel.findOne({email})
      return user
    } catch (err) {
      console.error('Error finding email', err);
      throw new Error('Error finding email')
    }
  }

  async getTokenResetPass(query) {
    try {
      const user = await UserModel.findOne(query);
      if (!user) {
        throw new Error('Không tìm thấy token đặt lại mật khẩu');
      }
      return user;
    } catch (err) {
      console.error('Lỗi tìm kiếm token:', err);
      throw new Error('Lỗi tìm kiếm token: ' + err.message);
    }
  }

  async getAll() {
    const users = await UserModel.find();
    if (!users) throw new Error('Not found user');
    
    return users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email
    }));
  }

  async deleteOneById(id) {
    const deletedUser = await UserModel.findOneAndDelete({ _id: id }).lean();
    if (!deletedUser) throw new Error('not found');
    
    return {
      id: String(deletedUser._id),
      name: deletedUser.name,
      email: deletedUser.email,
    };
  }
}