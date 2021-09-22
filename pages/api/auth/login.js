import db from '../../../utils/db';
import User from '../../../models/User';
import bycrpt from 'bcryptjs';
import { createAccessToken, createRefreshToken } from '../../../utils/token';

db.connect();

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      await login(req, res);
      break;
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(req.body);

    if (!user)
      return res.status(400).json({ err: 'This user does not exist.' });

    const isMatch = bycrpt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ err: 'Incorrect password' });

    const access_token = createAccessToken({ id: user._id });
    const refresh_token = createRefreshToken({ id: user._id });

    res.json({
      msg: 'Login success!',
      refresh_token,
      access_token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        root: user.root,
      },
    });
  } catch (err) {
    return res.status(500).json({
      err: err.message,
    });
  }
};
