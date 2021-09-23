import auth from '../../../middleware/auth';
import db from '../../../utils/db';
import bycrypt from 'bcryptjs';
import User from '../../../models/User';

db.connect();

export default async function handler(req, res) {
  switch (req.method) {
    case 'PATCH':
      await uploadInfo(req, res);
      break;
    default:
      res.status(400).json({ err: 'Invalid Method' });
  }
}

const uploadInfo = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { name, avatar } = req.body;

    const newUser = await User.findOneAndUpdate(
      { _id: result.id },
      {
        name,
        avatar,
      }
    ).select('-password');

    res.json({
      msg: 'Update success!',
      user: {
        id: newUser.id,
        name,
        avatar,
        email: newUser.email,
        role: newUser.role,
        root: newUser.root,
      },
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
