import UserModel from '../models/users.model.js';

export class UserRepository {
  async create(dto) {
    const { name, email, password, role} = dto;

    if (!name || !email || !password) {
      console.log(name,  email, password);
      throw new Error('Name, email, and password are required.');
    }
    const result = await UserModel.create({
      name,
      email,
      password,
      role
    });

    return {
      name,
      email,
      _id: String(result._id),
      role
    };
  }

  async findById(id) {
    const user = await UserModel.findOne({
      _id: id,
    });

    if (!user) {
      throw new Error('not found');
    }

    return {
      _id: String(user._id),
      name: String(user.name),
      email: String(user.email),
    };
  }

  async findByUsername(name) {
    try {
      if (!name) {
        throw new Error('Vui lòng cung cấp tên người dùng!');
    }
    const user = await UserModel.findOne({ name }).lean();
    if (!user) {
        console.log(`Không tìm thấy người dùng với tên: ${name}`);
        return null;
    }
    if (!user._id) {
        console.error('Người dùng không có _id:', user);
        throw new Error('Dữ liệu người dùng không hợp lệ: Thiếu _id');
    }
    return user;
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

  async updateUserByUsername(username, updateData) {
    return await UserModel.findOneAndUpdate(
      { name: username },
      updateData,
      { new: true }
    );
  }

  async getAll() {
    const users = await UserModel.find();
    if (!users) throw new Error('Not found user');
    
    return users.map(user => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      linkImage: user.linkImages
    }));
  }

  async deleteOneById(id) {
    const deletedUser = await UserModel.findOneAndDelete({ _id: id }).lean();
    if (!deletedUser) throw new Error('not found');
    
    return {
      _id: String(deletedUser._id),
      name: deletedUser.name,
      email: deletedUser.email,
    };
  }
}