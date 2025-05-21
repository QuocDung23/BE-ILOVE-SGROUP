import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: String },
  resetPasswordToken: {type: String},
  resetPasswordExpires: {type:Date},
  linkImages: {type: String, default: ''},
  role: {type: String, enum: ['admin', 'member'], default:'member'}
},
{ timestamps: true });



const UserModel = mongoose.model('User', userSchema);

export default UserModel;