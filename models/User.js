import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
    root: { type: String, required: true, default: false },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/smartfanis/image/upload/v1631895168/avatar/AvatarMaker_illwbk.png',
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.user || mongoose.model('user', userSchema);

export default User;
