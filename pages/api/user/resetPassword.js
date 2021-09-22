import auth from '../../../middleware/auth';
import db from '../../../utils/db';
import bycrypt from 'bcryptjs';
import User from '../../../models/User';

db.connect();

export default async function handler(req, res) {
  switch (req.method) {
    case 'PATCH':
      await resetPassword(req, res);
      break;
    default:
      res.status(400).json({ err: 'Invalid Method' });
  }
}

const resetPassword = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { password } = req.body;
    const passwordHash = bycrypt.hashSync(password, 12);

    await User.findOneAndUpdate({ _id: result.id }, { password: passwordHash });

    res.json({ msg: 'Update success!' });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
