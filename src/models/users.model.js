import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: String },
  resetPasswordToken: {type: String},
  resetPasswordExpires: {type:Date},
  linkImages: {type: String, default: '' }
});



const UserModel = mongoose.model('User', userSchema);

export default UserModel;